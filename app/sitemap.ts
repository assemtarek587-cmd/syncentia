import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/site'
import { getCategories, getPublishedPosts, getPublishedProducts } from '@/lib/content'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    '/',
    '/about',
    '/blog',
    '/compare',
    '/contact',
    '/privacy-policy',
    '/terms',
    '/faq',
    '/advertise',
    '/disclaimer',
  ].map((route) => ({
    url: absoluteUrl(route),
    lastModified: new Date(),
  }))

  const [posts, categories, products] = await Promise.all([
    getPublishedPosts(),
    getCategories(),
    getPublishedProducts(),
  ])

  return [
    ...staticRoutes,
    ...posts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: post.published_at ? new Date(post.published_at) : new Date(),
    })),
    ...categories.map((category) => ({
      url: absoluteUrl(`/category/${category.slug}`),
      lastModified: new Date(),
    })),
    ...products.map((product) => ({
      url: absoluteUrl(`/product/${product.slug}`),
      lastModified: new Date(),
    })),
  ]
}
