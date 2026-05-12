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

function parseArray(input: string | null) {
  if (!input) return []
  return input.split('\n').map(s => s.trim()).filter(Boolean)
}

function productPayload(formData: FormData) {
  const name = value(formData, 'name') || ''
  const slug = value(formData, 'slug') || slugify(name)

  return {
    name,
    slug,
    description: value(formData, 'description'),
    image_url: value(formData, 'image_url'),
    affiliate_url: value(formData, 'affiliate_url'),
    price: value(formData, 'price'),
    rating: formData.get('rating') ? parseFloat(formData.get('rating') as string) : null,
    features: parseArray(value(formData, 'features')),
    pros: parseArray(value(formData, 'pros')),
    cons: parseArray(value(formData, 'cons')),
    category_id: value(formData, 'category_id'),
    is_published: formData.get('is_published') === 'on',
    is_featured: formData.get('is_featured') === 'on',
  }
}

function revalidateProducts() {
  revalidatePath('/')
  revalidatePath('/compare')
  revalidatePath('/admin')
  revalidatePath('/admin/products')
}

export async function createProduct(formData: FormData) {
  const { supabase } = await requireAdmin()
  const payload = productPayload(formData)

  if (!payload.name || !payload.slug) {
    throw new Error('Name and slug are required.')
  }

  const { error } = await supabase.from('products').insert(payload)

  if (error) {
    throw new Error(error.message)
  }

  revalidateProducts()
  redirect('/admin/products')
}

export async function updateProduct(id: string, formData: FormData) {
  const { supabase } = await requireAdmin()
  const payload = productPayload(formData)

  if (!payload.name || !payload.slug) {
    throw new Error('Name and slug are required.')
  }

  const { error } = await supabase.from('products').update(payload).eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidateProducts()
  revalidatePath(`/product/${payload.slug}`)
  redirect('/admin/products')
}

export async function deleteProduct(formData: FormData) {
  const { supabase } = await requireAdmin()
  const id = value(formData, 'id')

  if (!id) {
    throw new Error('Product id is required.')
  }

  const { error } = await supabase.from('products').delete().eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidateProducts()
}
