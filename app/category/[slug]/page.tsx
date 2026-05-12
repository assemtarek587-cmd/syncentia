import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock, TrendingUp, Brain, Cloud, Server, GraduationCap, Gamepad2, Shield } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getCategoryBySlug, getPostsByCategory } from '@/lib/content'
import { formatDate } from '@/lib/format'
import { buildMetadata } from '@/lib/site'

interface PageProps {
  params: Promise<{ slug: string }>
}

interface CanonicalCategory {
  id: null
  name: string
  slug: string
  description: string
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

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'ai-tools': Brain,
  saas: Cloud,
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: rawSlug } = await params
  const slug = rawSlug.toLowerCase()
  const category = (await getCategoryBySlug(slug)) || canonicalCategories[slug]

  if (!category) {
    return buildMetadata({ title: 'Category Not Found', path: `/category/${slug}` })
  }

  return buildMetadata({
    title: category.name,
    description: category.description || `Browse ${category.name} articles and reviews.`,
    path: `/category/${category.slug}`,
  })
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug: rawSlug } = await params
  const slug = rawSlug.toLowerCase()
  const categoryFromSupabase = await getCategoryBySlug(slug)
  const category = categoryFromSupabase || canonicalCategories[slug]

  if (!category) {
    notFound()
  }

  const posts = categoryFromSupabase ? await getPostsByCategory(categoryFromSupabase.id) : []
  const Icon = categoryIcons[slug] || TrendingUp
  const gradientColor = categoryColors[slug] || 'from-primary/20 to-accent/20'

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
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${gradientColor} flex items-center justify-center mb-6`}>
              <Icon className="w-10 h-10 text-primary" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">{category.name}</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl">
              {category.description || `Explore our curated collection of ${category.name} articles, reviews, and comparisons.`}
            </p>

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
                        {category.name}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(post.published_at)}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    {post.excerpt && <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>}
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
