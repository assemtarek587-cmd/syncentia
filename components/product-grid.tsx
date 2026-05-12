'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Star, ExternalLink, Check, X, Brain, Cloud, Server, GraduationCap, Gamepad2, Shield } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

interface Category {
  id: string
  name: string
  slug: string
}

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  affiliate_url: string | null
  price: string | null
  rating: number | null
  features: string[]
  pros: string[]
  cons: string[]
  is_featured: boolean
  categories: Category | null
}

interface ProductGridProps {
  products: Product[]
  categories: Category[]
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'ai-tools': Brain,
  'saas': Cloud,
  'hosting': Server,
  'student-tech': GraduationCap,
  'gaming-setup': Gamepad2,
  'vpns': Shield,
}

export function ProductGrid({ products, categories }: ProductGridProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    const matchesCategory = !selectedCategory || product.categories?.slug === selectedCategory
    return matchesSearch && matchesCategory
  })

  const renderStars = (rating: number | null) => {
    if (!rating) return null
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-muted-foreground'
            }`}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-1">{rating}</span>
      </div>
    )
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
                placeholder="Search products..."
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
            Showing <span className="text-foreground font-medium">{filteredProducts.length}</span> products
            {selectedCategory && (
              <span> in <span className="text-primary">{categories.find(c => c.slug === selectedCategory)?.name}</span></span>
            )}
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const Icon = product.categories ? categoryIcons[product.categories.slug] || Brain : Brain
              
              return (
                <Card key={product.id} className="bg-card border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  <CardHeader className="pb-4">
                    {/* Image/Icon Area */}
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl mb-4 flex items-center justify-center relative">
                      <Icon className="w-16 h-16 text-primary/30" />
                      {product.is_featured && (
                        <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                          Featured
                        </Badge>
                      )}
                    </div>

                    {/* Category & Rating */}
                    <div className="flex items-center justify-between mb-2">
                      {product.categories && (
                        <Badge variant="outline" className="text-xs">
                          {product.categories.name}
                        </Badge>
                      )}
                      {renderStars(product.rating)}
                    </div>

                    {/* Name & Price */}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xl font-semibold">{product.name}</h3>
                      {product.price && (
                        <span className="text-primary font-semibold text-sm whitespace-nowrap">
                          {product.price}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    {product.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                        {product.description}
                      </p>
                    )}
                  </CardHeader>

                  <CardContent className="pt-0">
                    {/* Features */}
                    {product.features && product.features.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-muted-foreground mb-2">Key Features:</p>
                        <div className="flex flex-wrap gap-1">
                          {product.features.slice(0, 3).map((feature, i) => (
                            <span key={i} className="text-xs bg-secondary px-2 py-1 rounded">
                              {feature}
                            </span>
                          ))}
                          {product.features.length > 3 && (
                            <span className="text-xs text-muted-foreground px-2 py-1">
                              +{product.features.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Pros & Cons */}
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      {product.pros && product.pros.length > 0 && (
                        <div>
                          <p className="text-green-400 mb-1 font-medium">Pros</p>
                          <ul className="space-y-1">
                            {product.pros.slice(0, 2).map((pro, i) => (
                              <li key={i} className="flex items-start gap-1 text-muted-foreground">
                                <Check className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                                <span className="line-clamp-1">{pro}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {product.cons && product.cons.length > 0 && (
                        <div>
                          <p className="text-red-400 mb-1 font-medium">Cons</p>
                          <ul className="space-y-1">
                            {product.cons.slice(0, 2).map((con, i) => (
                              <li key={i} className="flex items-start gap-1 text-muted-foreground">
                                <X className="w-3 h-3 text-red-400 mt-0.5 flex-shrink-0" />
                                <span className="line-clamp-1">{con}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="pt-4 border-t border-border">
                    <div className="flex gap-2 w-full">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href={`/product/${product.slug}`}>
                          View Details
                        </Link>
                      </Button>
                      <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90" asChild>
                        <Link href={`/go/${product.slug}`} rel="nofollow sponsored">
                          Get It
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-2xl glass mx-auto mb-6 flex items-center justify-center">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter to find what you&apos;re looking for.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
