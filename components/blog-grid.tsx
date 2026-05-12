'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Clock, Search, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface Category {
  id: string
  name: string
  slug: string
}

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featured_image: string | null
  published_at: string | null
  is_featured: boolean
  categories: Category | null
}

interface BlogGridProps {
  posts: Post[]
  categories: Category[]
}

export function BlogGrid({ posts, categories }: BlogGridProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    const matchesCategory = !selectedCategory || post.categories?.slug === selectedCategory
    return matchesSearch && matchesCategory
  })

  const formatDate = (dateString: string | null) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <section className="py-12 relative">
      <div className="container mx-auto px-4">
        {/* Filters */}
        <div className="glass rounded-2xl p-6 mb-12">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-secondary border-border focus:border-primary"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className={selectedCategory === null ? 'bg-primary' : ''}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.slug ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.slug)}
                  className={selectedCategory === category.slug ? 'bg-primary' : ''}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-muted-foreground">
            Showing <span className="text-foreground font-medium">{filteredPosts.length}</span> articles
            {selectedCategory && (
              <span> in <span className="text-primary">{categories.find(c => c.slug === selectedCategory)?.name}</span></span>
            )}
          </p>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <TrendingUp className="w-12 h-12 text-primary/30" />
                  </div>
                  {post.is_featured && (
                    <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                      Featured
                    </Badge>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
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
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-2xl glass mx-auto mb-6 flex items-center justify-center">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No articles found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter to find what you&apos;re looking for.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
