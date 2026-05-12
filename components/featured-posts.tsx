import Link from 'next/link'
import { Clock, ArrowRight, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getFeaturedPosts, getPublishedPosts } from '@/lib/content'
import { formatDate } from '@/lib/format'

export async function FeaturedPosts() {
  const [featured, latest] = await Promise.all([getFeaturedPosts(3), getPublishedPosts()])
  const displayPosts = featured.length > 0 ? featured : latest.slice(0, 3)
  const displayIds = new Set(displayPosts.map((post) => post.id))
  const trendingPosts = latest.filter((post) => !displayIds.has(post.id)).slice(0, 4)

  return (
    <section className="py-24 relative bg-card/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Latest <span className="gradient-text">Articles</span>
            </h2>
            <p className="text-muted-foreground">
              Expert insights and in-depth reviews to help you make informed decisions.
            </p>
          </div>
          <Button variant="outline" className="self-start md:self-auto" asChild>
            <Link href="/blog">
              View All Articles
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        {displayPosts.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {displayPosts.map((post, index) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className={`group block rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-all duration-300 ${
                    index === 0 ? 'p-0' : 'p-6'
                  }`}
                >
                  {index === 0 ? (
                    <div>
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-24 h-24 rounded-full bg-primary/30 flex items-center justify-center">
                            <TrendingUp className="w-12 h-12 text-primary" />
                          </div>
                        </div>
                        {post.is_featured && (
                          <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          {post.categories && (
                            <Badge variant="outline" className="text-xs">
                              {post.categories.name}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(post.published_at)}
                          </span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="w-full md:w-48 h-32 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex-shrink-0 flex items-center justify-center">
                        <TrendingUp className="w-8 h-8 text-primary/50" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {post.categories && (
                            <Badge variant="outline" className="text-xs">
                              {post.categories.name}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(post.published_at)}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                        )}
                      </div>
                    </div>
                  )}
                </Link>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="glass rounded-2xl p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Trending Now</h3>
                </div>
                {trendingPosts.length > 0 ? (
                  <div className="space-y-4">
                    {trendingPosts.map((post, index) => (
                      <Link key={post.id} href={`/blog/${post.slug}`} className="group flex gap-4 items-start">
                        <span className="text-2xl font-bold text-muted-foreground/50 group-hover:text-primary transition-colors">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2 mb-1">
                            {post.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{post.categories?.name || 'Guide'}</span>
                            <span>-</span>
                            <span>{formatDate(post.published_at)}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">More articles will appear here as the CMS grows.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <TrendingUp className="mx-auto mb-4 h-10 w-10 text-primary" />
            <h3 className="mb-2 text-xl font-semibold">No published articles yet</h3>
            <p className="text-muted-foreground">Publish posts from the admin CMS to populate this section.</p>
          </div>
        )}
      </div>
    </section>
  )
}
