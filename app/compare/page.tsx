import { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { CompareHero } from '@/components/compare-hero'
import { ProductGrid } from '@/components/product-grid'
import { getCategories, getPublishedProducts } from '@/lib/content'
import { buildMetadata } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: 'Compare Products',
  description: 'Compare the best tech products side by side. Find the perfect tool for your needs.',
  path: '/compare',
})

export default async function ComparePage() {
  const [categories, products] = await Promise.all([getCategories(), getPublishedProducts()])

  return (
    <main className="min-h-screen">
      <Navbar />
      <CompareHero />
      <ProductGrid products={products} categories={categories} />
      <Footer />
    </main>
  )
}
