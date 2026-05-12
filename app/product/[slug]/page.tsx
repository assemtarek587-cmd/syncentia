import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, Check, Star, X } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { AffiliateCta } from '@/components/affiliate-cta'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getProductBySlug } from '@/lib/content'
import { buildMetadata, absoluteUrl } from '@/lib/site'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = params

  const product = await getProductBySlug(slug)

  if (!product) {
    return buildMetadata({ title: 'Product Not Found', path: `/product/${slug}` })
  }

  return buildMetadata({
    title: `${product.name} Review`,
    description: product.description || `Review and details for ${product.name}.`,
    path: `/product/${product.slug}`,
  })
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = params

  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  // SEO Engine: Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image_url || absoluteUrl('/placeholder.jpg'),
    aggregateRating: product.rating ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: 1,
    } : undefined,
    offers: {
      '@type': 'Offer',
      price: product.price ? product.price.replace(/[^0-9.]/g, '') : '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: absoluteUrl(`/go/${product.slug}`),
    }
  }

  return (
    <main className="min-h-screen">
      {/* SEO Engine: Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <Button variant="ghost" size="sm" className="mb-8" asChild>
            <Link href="/compare">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Compare
            </Link>
          </Button>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              {product.categories && (
                <Badge variant="outline" className="mb-4">
                  {product.categories.name}
                </Badge>
              )}
              <h1 className="mb-4 text-4xl font-bold md:text-5xl">
                <span className="gradient-text">{product.name}</span>
              </h1>
              {product.description && (
                <p className="max-w-3xl text-lg text-muted-foreground">{product.description}</p>
              )}

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h2 className="mb-4 text-lg font-semibold">Pros</h2>
                  <ul className="space-y-3">
                    {product.pros.map((pro) => (
                      <li key={pro} className="flex gap-2 text-sm text-muted-foreground">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6">
                  <h2 className="mb-4 text-lg font-semibold">Cons</h2>
                  <ul className="space-y-3">
                    {product.cons.map((con) => (
                      <li key={con} className="flex gap-2 text-sm text-muted-foreground">
                        <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {product.features.length > 0 && (
                <div className="mt-6 rounded-2xl border border-border bg-card p-6">
                  <h2 className="mb-4 text-lg font-semibold">Key Features</h2>
                  <div className="flex flex-wrap gap-2">
                    {product.features.map((feature) => (
                      <span key={feature} className="rounded-md bg-secondary px-3 py-2 text-sm">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className="rounded-2xl border border-border bg-card p-6 h-fit">
              <div className="mb-6 aspect-video rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden relative flex items-center justify-center">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-primary/50 font-bold text-xl">No Image</span>
                )}
              </div>
              {product.rating && (
                <div className="mb-4 flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold">{product.rating}/5</span>
                </div>
              )}
              {product.price && <p className="mb-6 text-2xl font-bold text-primary">{product.price}</p>}
              <AffiliateCta slug={product.slug} label="Get This Product" className="w-full" />
              <p className="mt-4 text-xs text-muted-foreground">
                Syncentia may earn a commission when you purchase through tracked links.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
