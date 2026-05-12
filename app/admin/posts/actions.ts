'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/admin-auth'
import { Resend } from 'resend'

function value(formData: FormData, key: string) {
  const entry = formData.get(key)
  return typeof entry === 'string' && entry.trim() ? entry.trim() : null
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function postPayload(formData: FormData) {
  const title = value(formData, 'title') || ''
  const slug = value(formData, 'slug') || slugify(title)
  const isPublished = formData.get('is_published') === 'on'

  return {
    title,
    slug,
    excerpt: value(formData, 'excerpt'),
    content: value(formData, 'content'),
    featured_image: value(formData, 'featured_image'),
    category_id: value(formData, 'category_id'),
    is_published: isPublished,
    is_featured: formData.get('is_featured') === 'on',
    published_at: isPublished ? new Date().toISOString() : null,
  }
}

function revalidateContent() {
  revalidatePath('/')
  revalidatePath('/blog')
  revalidatePath('/admin')
  revalidatePath('/admin/posts')
}

// Automated Marketing Engine Hook
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function notifySubscribers(supabase: any, postTitle: string, postSlug: string) {
  if (!process.env.RESEND_API_KEY) {
    console.log('Marketing Engine: RESEND_API_KEY not set. Skipping email broadcast.')
    return
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)

    const { data: subscribers } = await supabase
      .from('newsletter_subscribers')
      .select('email')
      .eq('is_active', true)

    if (!subscribers || subscribers.length === 0) return

    const postUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://syncentia.com'}/blog/${postSlug}`

    const emails = subscribers.map((sub: { email: string }) => ({
      from: 'Syncentia <newsletter@syncentia.com>',
      to: sub.email,
      subject: `New Post: ${postTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>${postTitle}</h2>
          <p>We just published a new article on Syncentia.</p>
          <p><a href="${postUrl}" style="display: inline-block; padding: 10px 20px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">Read it here</a></p>
          <hr style="margin-top: 30px; border: none; border-top: 1px solid #eaeaea;" />
          <p style="color: #666; font-size: 12px;">You are receiving this because you subscribed to our newsletter.</p>
        </div>
      `,
    }))

    // Resend batch API allows up to 100 emails per request
    const BATCH_SIZE = 100
    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      const batch = emails.slice(i, i + BATCH_SIZE)
      await resend.batch.send(batch)
    }
    console.log(`Marketing Engine: Broadcasted to ${subscribers.length} subscribers.`)
  } catch (error) {
    console.error('Marketing Engine Error:', error)
  }
}

export async function createPost(formData: FormData) {
  const { supabase } = await requireAdmin()
  const payload = postPayload(formData)

  if (!payload.title || !payload.slug) {
    throw new Error('Title and slug are required.')
  }

  const { error } = await supabase.from('posts').insert(payload)

  if (error) {
    throw new Error(error.message)
  }

  if (payload.is_published) {
    // Fire and forget to prevent blocking the UI
    notifySubscribers(supabase, payload.title, payload.slug).catch(console.error)
  }

  revalidateContent()
  redirect('/admin/posts')
}

export async function updatePost(id: string, formData: FormData) {
  const { supabase } = await requireAdmin()
  const payload = postPayload(formData)

  if (!payload.title || !payload.slug) {
    throw new Error('Title and slug are required.')
  }

  // Check previous state to see if it's newly published
  const { data: previousPost } = await supabase.from('posts').select('is_published').eq('id', id).single()

  const { error } = await supabase.from('posts').update(payload).eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  if (payload.is_published && previousPost && !previousPost.is_published) {
    // Fire and forget to prevent blocking the UI
    notifySubscribers(supabase, payload.title, payload.slug).catch(console.error)
  }

  revalidateContent()
  revalidatePath(`/blog/${payload.slug}`)
  redirect('/admin/posts')
}

export async function deletePost(formData: FormData) {
  const { supabase } = await requireAdmin()
  const id = value(formData, 'id')

  if (!id) {
    throw new Error('Post id is required.')
  }

  const { error } = await supabase.from('posts').delete().eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidateContent()
}
