'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/admin-auth'

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

function payload(formData: FormData) {
  const title = value(formData, 'title') || ''
  const slug = value(formData, 'slug') || slugify(title)
  const destinationUrl = value(formData, 'destination_url') || ''

  try {
    new URL(destinationUrl)
  } catch {
    throw new Error('Destination URL must be a valid absolute URL.')
  }

  return {
    title,
    slug,
    destination_url: destinationUrl,
    description: value(formData, 'description'),
    cta_label: value(formData, 'cta_label') || 'Visit Site',
    category_id: value(formData, 'category_id'),
    is_active: formData.get('is_active') === 'on',
    is_featured: formData.get('is_featured') === 'on',
  }
}

function revalidateAffiliate() {
  revalidatePath('/admin')
  revalidatePath('/admin/affiliate-links')
  revalidatePath('/compare')
}

export async function createAffiliateLink(formData: FormData) {
  const { supabase } = await requireAdmin()
  const data = payload(formData)

  if (!data.title || !data.slug) {
    throw new Error('Title and slug are required.')
  }

  const { error } = await supabase.from('affiliate_links').insert(data)

  if (error) {
    throw new Error(error.message)
  }

  revalidateAffiliate()
  redirect('/admin/affiliate-links')
}

export async function updateAffiliateLink(id: string, formData: FormData) {
  const { supabase } = await requireAdmin()
  const data = payload(formData)

  if (!data.title || !data.slug) {
    throw new Error('Title and slug are required.')
  }

  const { error } = await supabase.from('affiliate_links').update(data).eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidateAffiliate()
  redirect('/admin/affiliate-links')
}

export async function deleteAffiliateLink(formData: FormData) {
  const { supabase } = await requireAdmin()
  const id = value(formData, 'id')

  if (!id) {
    throw new Error('Affiliate link id is required.')
  }

  const { error } = await supabase.from('affiliate_links').delete().eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidateAffiliate()
}
