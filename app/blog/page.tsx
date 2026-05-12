import { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { BlogGrid } from '@/components/blog-grid'
import { BlogHero } from '@/components/blog-hero'
import { getCategories, getPublishedPosts } from '@/lib/content'
import { buildMetadata } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: 'Blog',
  description: 'Expert reviews, in-depth comparisons, and guides for AI tools, SaaS, hosting, and more.',
  path: '/blog',
})

export default async function BlogPage() {
  const [categories, posts] = await Promise.all([getCategories(), getPublishedPosts()])

  return (
    <main className="min-h-screen">
      <Navbar />
      <BlogHero />
      <BlogGrid posts={posts} categories={categories} />
      <Footer />
    </main>
  )
}
