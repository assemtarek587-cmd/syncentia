import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { CategoriesSection } from '@/components/categories-section'
import { FeaturedPosts } from '@/components/featured-posts'
import { NewsletterSection } from '@/components/newsletter-section'
import { Footer } from '@/components/footer'
import { AdSlot } from '@/components/ad-slot'
import { buildMetadata } from '@/lib/site'

export const metadata = buildMetadata({
  path: '/',
})

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <div className="container mx-auto px-4 py-8">
        <AdSlot placement="home-top" />
      </div>
      <CategoriesSection />
      <FeaturedPosts />
      <NewsletterSection />
      <Footer />
    </main>
  )
}
