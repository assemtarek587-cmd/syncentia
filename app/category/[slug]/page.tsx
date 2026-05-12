import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  BadgeCheck,
  Clock,
  Gamepad2,
  GraduationCap,
  Shield,
  Server,
  TrendingUp,
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getCategoryBySlug, getPostsByCategory } from '@/lib/content'
import { formatDate } from '@/lib/format'
import { buildMetadata } from '@/lib/site'

type PageProps = {
  params: { slug: string }
}

type CanonicalCategory = {
  id: null
  name: string
  slug: string
  description: string | null
}



type PostForList = {
  id: string
  slug: string
  title: string
  excerpt: string
  published_at: string | null
}

const canonicalCategories: Record<string, CanonicalCategory> = {
  'ai-tools': {
    id: null,
    name: 'AI Tools',
    slug: 'ai-tools',
    description: 'Cutting-edge artificial intelligence tools and platforms',
  },
  saas: {
    id: null,
    name: 'SaaS',
    slug: 'saas',
    description: 'Software as a Service solutions for businesses',
  },
  hosting: {
    id: null,
    name: 'Hosting',
    slug: 'hosting',
    description: 'Web hosting and cloud infrastructure services',
  },
  'student-tech': {
    id: null,
    name: 'Student Tech',
    slug: 'student-tech',
    description: 'Essential tech for students and learners',
  },
  'gaming-setup': {
    id: null,
    name: 'Gaming Setup',
    slug: 'gaming-setup',
    description: 'Gaming gear and accessories',
  },
  vpns: {
    id: null,
    name: 'VPNs',
    slug: 'vpns',
    description: 'Privacy and security VPN services',
  },
}

const categoryIcons: Record<string, (props: { className?: string }) => React.ReactNode> = {
  'ai-tools': BadgeCheck,
  saas: Server,
  hosting: Server,
  'student-tech': GraduationCap,
  'gaming-setup': Gamepad2,
  vpns: Shield,
}

const categoryColors: Record<string, string> = {
  'ai-tools': 'from-violet-500/20 to-purple-500/20',
  saas: 'from-blue-500/20 to-cyan-500/20',
  hosting: 'from-emerald-500/20 to-green-500/20',
  'student-tech': 'from-amber-500/20 to-yellow-500/20',
  'gaming-setup': 'from-rose-500/20 to-red-500/20',
  vpns: 'from-teal-500/20 to-cyan-500/20',
}

function normalizeSlug(value: unknown): string {
  if (typeof value !== 'string') return ''
  const trimmed = value.trim()
  if (!trimmed) return ''
  return trimmed.toLowerCase()
}

function safeNonEmptyString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim().length > 0 ? value : fallback
}

function safeCategoryDescription(description: unknown, name: string): string {
  if (typeof description === 'string' && description.trim().length > 0) return description
  return `Explore our curated collection of ${name} articles, reviews, and comparisons.`
}

function safePostList(posts: unknown): PostForList[] {
  if (!Array.isArray(posts)) return []

  return posts
    .map((p: any, idx: number): PostForList | null => {
      const slug = safeNonEmptyString(p?.slug, '')
      const title = safeNonEmptyString(p?.title, 'Untitled')
      const excerpt = typeof p?.excerpt === 'string' ? p.excerpt : ''
      const publishedAt = typeof p?.published_at === 'string' ? p.published_at : null
      const id = safeNonEmptyString(p?.id ?? slug ?? String(idx), String(idx))

      if (!slug) return null

      return {
        id,
        slug,
        title,
        excerpt,
        published_at: publishedAt,
      }
    })
    .filter((x): x is PostForList => Boolean(x))
}

function getCategoryFromSupabaseOrCanonical(slug: string): { category: CanonicalCategory | null; posts: PostForList[] } {
  return { category: canonicalCategories[slug] ?? null, posts: [] }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const slug = normalizeSlug(params?.slug)

  const canonical = slug ? canonicalCategories[slug] : undefined
  const name = canonical?.name ?? 'Category'
  const description = safeCategoryDescription(canonical?.description, name)

  if (!slug) return buildMetadata({ title: 'Category Not Found', path: '/category' })

  try {
    const categoryFromSupabase = await getCategoryBySlug(slug)
    const category = categoryFromSupabase
      ? {
          id: null,
          name: safeNonEmptyString(categoryFromSupabase.name, name),
          slug: safeNonEmptyString(categoryFromSupabase.slug, slug),
          description: categoryFromSupabase.description,
        }
      : canonical

    if (!category) return buildMetadata({ title: 'Category Not Found', path: `/category/${slug}` })

    const categoryName = safeNonEmptyString(category.name, 'Category')
    const categorySlug = safeNonEmptyString(category.slug, slug)
    const categoryDescription = safeCategoryDescription(category.description, categoryName)

    return buildMetadata({
      title: categoryName,
      description: categoryDescription,
      path: `/category/${categorySlug}`,
    })
  } catch {
    if (!canonical) return buildMetadata({ title: 'Category Not Found', path: `/category/${slug}` })

    return buildMetadata({
      title: name,
      description,
      path: `/category/${slug}`,
    })
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const slug = normalizeSlug(params?.slug)

  if (!slug) notFound()

  const { category, posts } = await (async () => {
    try {
      const categoryFromSupabase = await getCategoryBySlug(slug)
      const resolvedCategory = categoryFromSupabase
        ? {
            id: null,
            name: safeNonEmptyString(categoryFromSupabase.name, canonicalCategories[slug]?.name ?? 'Category'),
            slug: safeNonEmptyString(categoryFromSupabase.slug, slug),
            description: categoryFromSupabase.description,
          }
        : canonicalCategories[slug] ?? null

      if (!resolvedCategory) return { category: null, posts: [] as PostForList[] }

      try {
        const categoryId = categoryFromSupabase?.id
        const fetchedPosts = categoryId ? await getPostsByCategory(categoryId) : []
        return { category: resolvedCategory, posts: safePostList(fetchedPosts) }
      } catch {
        return { category: resolvedCategory, posts: [] as PostForList[] }
      }
    } catch {
      const resolvedCategory = canonicalCategories[slug] ?? null
      return { category: resolvedCategory, posts: [] as PostForList[] }
    }
  })()

  if (!category) notFound()

  const Icon = categoryIcons[slug] ?? TrendingUp
  const gradientColor = categoryColors[slug] ?? 'from-primary/20 to-accent/20'

  const safeName = safeNonEmptyString(category.name, 'Category')
  const safeDescription = safeCategoryDescription(category.description, safeName)

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br ${gradientColor} rounded-full blur-[150px]`}
        />

        <div className="container mx-auto px-4 relative z-10">
          <Button variant="ghost" size="sm" className="mb-8" asChild>
            <Link href="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>

          <div className="max-w-3xl">
            <div
              className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${gradientColor} flex items-center justify-center mb-6`}
            >
              <Icon className="w-10 h-10 text-primary" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">{safeName}</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl">{safeDescription}</p>

            <div className="mt-8 flex items-center gap-6">
              <div className="glass px-4 py-2 rounded-lg">
                <span className="text-2xl font-bold gradient-text">{posts.length}</span>
                <span className="text-sm text-muted-foreground ml-2">Articles</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`aspect-video bg-gradient-to-br ${gradientColor} relative`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon className="w-12 h-12 text-primary/30" />
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="outline" className="text-xs">
                        {safeName}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.published_at ? formatDate(post.published_at) : '—'}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    {post.excerpt ? (
                      <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-2xl glass mx-auto mb-6 flex items-center justify-center">
                <Icon className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No articles yet</h3>
              <p className="text-muted-foreground">Publish posts in this category from the admin CMS.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}

