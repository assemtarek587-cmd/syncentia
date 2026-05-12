'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/admin-auth'

function value(formData: FormData, key: string) {
  const entry = formData.get(key)
  return typeof entry === 'string' && entry.trim() ? entry.trim() : null
}

function payload(formData: FormData) {
  return {
    name: value(formData, 'name'),
    placement: value(formData, 'placement'),
    slot_id: value(formData, 'slot_id'),
    format: value(formData, 'format') || 'auto',
    label: value(formData, 'label') || 'Advertisement',
    is_active: formData.get('is_active') === 'on',
  }
}

function revalidateAds() {
  revalidatePath('/')
  revalidatePath('/blog')
  revalidatePath('/admin')
  revalidatePath('/admin/ads')
}

export async function createAd(formData: FormData) {
  const { supabase } = await requireAdmin()
  const data = payload(formData)

  if (!data.name || !data.placement) {
    throw new Error('Name and placement are required.')
  }

  const { error } = await supabase.from('ads').insert(data)

  if (error) {
    throw new Error(error.message)
  }

  revalidateAds()
  redirect('/admin/ads')
}

export async function updateAd(id: string, formData: FormData) {
  const { supabase } = await requireAdmin()
  const data = payload(formData)

  if (!data.name || !data.placement) {
    throw new Error('Name and placement are required.')
  }

  const { error } = await supabase.from('ads').update(data).eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidateAds()
  redirect('/admin/ads')
}

export async function deleteAd(formData: FormData) {
  const { supabase } = await requireAdmin()
  const id = value(formData, 'id')

  if (!id) {
    throw new Error('Ad id is required.')
  }

  const { error } = await supabase.from('ads').delete().eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidateAds()
}
