'use server'

import { revalidatePath } from 'next/cache'
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

export async function createCategory(formData: FormData) {
  const { supabase } = await requireAdmin()
  const name = value(formData, 'name')
  const slug = value(formData, 'slug') || (name ? slugify(name) : null)

  if (!name || !slug) {
    throw new Error('Name and slug are required.')
  }

  const { error } = await supabase.from('categories').insert({
    name,
    slug,
    description: value(formData, 'description'),
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/')
  revalidatePath('/blog')
  revalidatePath('/admin/categories')
}

export async function deleteCategory(formData: FormData) {
  const { supabase } = await requireAdmin()
  const id = value(formData, 'id')

  if (!id) {
    throw new Error('Category id is required.')
  }

  const { error } = await supabase.from('categories').delete().eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/')
  revalidatePath('/blog')
  revalidatePath('/admin/categories')
}
