import { createClient } from '@/lib/supabase/server'

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
}

export interface PostSummary {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featured_image: string | null
  published_at: string | null
  is_featured: boolean
  category_id: string | null
  categories: Category | null
}

export interface PostDetail extends PostSummary {
  content: string | null
  created_at: string | null
  updated_at: string | null
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  affiliate_url: string | null
  price: string | null
  rating: number | null
  features: string[]
  pros: string[]
  cons: string[]
  is_featured: boolean
  category_id: string | null
  categories: Category | null
}

function mapCategory(categories: Category[], categoryId: string | null) {
  return categories.find((category) => category.id === categoryId) || null
}

function normalizeArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, description')
    .order('name')

  if (error) return []
  return data || []
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createClient()
  if (!supabase) return null
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, description')
    .eq('slug', slug)
    .maybeSingle()

  if (error) return null
  return data
}

export async function getPublishedPosts(): Promise<PostSummary[]> {
  const supabase = await createClient()
  if (!supabase) return []
  const categories = await getCategories()
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, featured_image, published_at, is_featured, category_id')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  if (error) return []

  return (data || []).map((post) => ({
    ...post,
    categories: mapCategory(categories, post.category_id),
  }))
}

export async function getFeaturedPosts(limit = 3): Promise<PostSummary[]> {
  const supabase = await createClient()
  if (!supabase) return []
  const categories = await getCategories()
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, featured_image, published_at, is_featured, category_id')
    .eq('is_published', true)
    .eq('is_featured', true)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) return []

  return (data || []).map((post) => ({
    ...post,
    categories: mapCategory(categories, post.category_id),
  }))
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  const supabase = await createClient()
  if (!supabase) return null
  const categories = await getCategories()
  const { data, error } = await supabase
    .from('posts')
    .select(
      'id, title, slug, excerpt, content, featured_image, published_at, is_featured, category_id, created_at, updated_at',
    )
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle()

  if (error || !data) return null

  return {
    ...data,
    categories: mapCategory(categories, data.category_id),
  }
}

export async function getPostsByCategory(categoryId: string): Promise<PostSummary[]> {
  const supabase = await createClient()
  if (!supabase) return []
  const categories = await getCategories()
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, featured_image, published_at, is_featured, category_id')
    .eq('category_id', categoryId)
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  if (error) return []

  return (data || []).map((post) => ({
    ...post,
    categories: mapCategory(categories, post.category_id),
  }))
}

export async function getRelatedPosts(
  categoryId: string | null,
  currentSlug: string,
  limit = 3,
): Promise<PostSummary[]> {
  if (!categoryId) return []

  const supabase = await createClient()
  if (!supabase) return []
  const categories = await getCategories()
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, featured_image, published_at, is_featured, category_id')
    .eq('category_id', categoryId)
    .eq('is_published', true)
    .neq('slug', currentSlug)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) return []

  return (data || []).map((post) => ({
    ...post,
    categories: mapCategory(categories, post.category_id),
  }))
}

export async function getPublishedProducts(): Promise<Product[]> {
  const supabase = await createClient()
  if (!supabase) return []
  const categories = await getCategories()
  const { data, error } = await supabase
    .from('products')
    .select(
      'id, name, slug, description, image_url, affiliate_url, price, rating, features, pros, cons, is_featured, category_id',
    )
    .eq('is_published', true)
    .order('is_featured', { ascending: false })
    .order('rating', { ascending: false })

  if (error) return []

  return (data || []).map((product) => ({
    ...product,
    affiliate_url: product.affiliate_url || null,
    features: normalizeArray(product.features),
    pros: normalizeArray(product.pros),
    cons: normalizeArray(product.cons),
    categories: mapCategory(categories, product.category_id),
  }))
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient()
  if (!supabase) return null
  const categories = await getCategories()
  const { data, error } = await supabase
    .from('products')
    .select(
      'id, name, slug, description, image_url, affiliate_url, price, rating, features, pros, cons, is_featured, category_id',
    )
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle()

  if (error || !data) return null

  return {
    ...data,
    affiliate_url: data.affiliate_url || null,
    features: normalizeArray(data.features),
    pros: normalizeArray(data.pros),
    cons: normalizeArray(data.cons),
    categories: mapCategory(categories, data.category_id),
  }
}
