import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AdSlot } from '@/components/ad-slot'
import { ProseContent } from '@/components/prose-content'
import { getPostBySlug, getRelatedPosts } from '@/lib/content'
import { formatDate } from '@/lib/format'
import { buildMetadata, absoluteUrl } from '@/lib/site'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return buildMetadata({ title: 'Post Not Found', path: `/blog/${slug}` })
  }

  return buildMetadata({
    title: post.title,
    description: post.excerpt || undefined,
    path: `/blog/${post.slug}`,
  })
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post.category_id, post.slug)
  
  // SEO Engine: Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.featured_image || absoluteUrl('/placeholder.jpg'),
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Organization',
      name: 'Syncentia Team',
      url: absoluteUrl('/'),
    },
  }

  return (
    <main className="min-h-screen">
      {/* SEO Engine: Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Navbar />

      <article className="pt-28 pb-16">
        <div className="container mx-auto px-4">
          <Button variant="ghost" size="sm" className="mb-8" asChild>
            <Link href="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>

          <header className="max-w-4xl mx-auto mb-12">
            {post.categories && (
              <Link href={`/category/${post.categories.slug}`}>
                <Badge variant="outline" className="mb-4 hover:bg-primary/10">
                  {post.categories.name}
                </Badge>
              </Link>
            )}

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-balance">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-xl text-muted-foreground mb-8 text-pretty">{post.excerpt}</p>
            )}

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pb-8 border-b border-border">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Syncentia Team</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.published_at, 'long')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{Math.max(3, Math.ceil((post.content || '').split(/\s+/).length / 220))} min read</span>
              </div>
            </div>
          </header>

          <div className="max-w-4xl mx-auto mb-12">
            {post.featured_image ? (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
                <Image 
                  src={post.featured_image} 
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-primary/30 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-4xl font-bold gradient-text">S</span>
                  </div>
                  <p className="text-muted-foreground">Syncentia Guide</p>
                </div>
              </div>
            )}
          </div>

          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="min-w-0">
              <div className="prose prose-invert prose-lg max-w-none">
                <ProseContent content={post.content || ''} />
              </div>
              <div className="my-12">
                <AdSlot placement="in-article" />
              </div>
            </div>

            <aside className="space-y-6">
              <AdSlot placement="sidebar" />
              {relatedPosts.length > 0 && (
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h2 className="mb-4 text-lg font-semibold">Related Articles</h2>
                  <div className="space-y-4">
                    {relatedPosts.map((relatedPost) => (
                      <Link
                        key={relatedPost.id}
                        href={`/blog/${relatedPost.slug}`}
                        className="block border-b border-border pb-4 last:border-0 last:pb-0"
                      >
                        <h3 className="line-clamp-2 text-sm font-medium transition-colors hover:text-primary">
                          {relatedPost.title}
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatDate(relatedPost.published_at)}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>

          <div className="max-w-3xl mx-auto mt-16 pt-8 border-t border-border">
            <div className="glass rounded-2xl p-6 flex flex-col md:flex-row gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-primary-foreground">S</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Syncentia Team</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Independent research and practical comparisons for readers choosing modern tech products.
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  )
}
