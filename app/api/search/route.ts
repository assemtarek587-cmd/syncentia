import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Prevent Next.js static prerender from attempting to render this route.
// This route is inherently request-dependent (uses request.url).
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const query = url.searchParams.get('q')?.trim() ?? ''

    if (query.length < 2) {
      return NextResponse.json({ results: [] })
    }

    const search = `%${query.replace(/[%_]/g, '\\$&')}%`
    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json({ results: [] })
    }

    const [postsResponse, linksResponse, categoriesResponse] = await Promise.all([
      supabase
        .from('posts')
        .select('title,slug,category_id,categories(name,slug)')
        .eq('is_published', true)
        .or(`title.ilike.${search},excerpt.ilike.${search}`)
        .limit(6),
      supabase
        .from('affiliate_links')
        .select('title,slug,category_id,categories(name,slug)')
        .eq('is_active', true)
        .or(`title.ilike.${search},description.ilike.${search}`)
        .limit(5),
      supabase
        .from('categories')
        .select('name,slug,description')
        .ilike('name', search)
        .limit(4),
    ])

    if (postsResponse.error || linksResponse.error || categoriesResponse.error) {
      console.error('Search API error', {
        postsError: postsResponse.error,
        linksError: linksResponse.error,
        categoriesError: categoriesResponse.error,
      })
      return NextResponse.json({ results: [] }, { status: 500 })
    }

    const postResults = (postsResponse.data || []).map((post: any) => ({
      type: 'post',
      title: post.title,
      url: `/blog/${post.slug}`,
      subtitle: post.categories?.name ? `Category: ${post.categories.name}` : 'Blog post',
    }))

    const affiliateResults = (linksResponse.data || []).map((link: any) => ({
      type: 'affiliate_link',
      title: link.title,
      url: `/go/${link.slug}`,
      subtitle: link.categories?.name ? `Category: ${link.categories.name}` : 'Affiliate link',
    }))

    const categoryResults = (categoriesResponse.data || []).map((category: any) => ({
      type: 'category',
      title: category.name,
      url: `/category/${category.slug}`,
      subtitle: category.description || 'Category page',
    }))

    return NextResponse.json({
      results: [...postResults, ...affiliateResults, ...categoryResults],
    })
  } catch (error) {
    console.error('Search API error', error)
    return NextResponse.json({ results: [] }, { status: 500 })
  }
}
