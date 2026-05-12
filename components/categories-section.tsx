import Link from 'next/link'
import { Brain, Cloud, Server, GraduationCap, Gamepad2, Shield, ArrowRight } from 'lucide-react'
import { getCategories } from '@/lib/content'

const categories = [
  {
    name: 'AI Tools',
    slug: 'ai-tools',
    description: 'Cutting-edge artificial intelligence tools and platforms',
    icon: Brain,
    color: 'from-violet-500/20 to-purple-500/20',
    borderColor: 'hover:border-violet-500/50',
  },
  {
    name: 'SaaS',
    slug: 'saas',
    description: 'Software as a Service solutions for businesses',
    icon: Cloud,
    color: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'hover:border-blue-500/50',
  },
  {
    name: 'Hosting',
    slug: 'hosting',
    description: 'Web hosting and cloud infrastructure services',
    icon: Server,
    color: 'from-emerald-500/20 to-green-500/20',
    borderColor: 'hover:border-emerald-500/50',
  },
  {
    name: 'Student Tech',
    slug: 'student-tech',
    description: 'Essential tech for students and learners',
    icon: GraduationCap,
    color: 'from-amber-500/20 to-yellow-500/20',
    borderColor: 'hover:border-amber-500/50',
  },
  {
    name: 'Gaming Setup',
    slug: 'gaming-setup',
    description: 'Gaming gear and accessories',
    icon: Gamepad2,
    color: 'from-rose-500/20 to-red-500/20',
    borderColor: 'hover:border-rose-500/50',
  },
  {
    name: 'VPNs',
    slug: 'vpns',
    description: 'Privacy and security VPN services',
    icon: Shield,
    color: 'from-teal-500/20 to-cyan-500/20',
    borderColor: 'hover:border-teal-500/50',
  },
]

export async function CategoriesSection() {
  const databaseCategories = await getCategories()
  const displayCategories = categories.map((category) => {
    const databaseCategory = databaseCategories.find((item) => item.slug === category.slug)

    return {
      ...category,
      name: databaseCategory?.name || category.name,
      description: databaseCategory?.description || category.description,
    }
  })

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Explore by <span className="gradient-text">Category</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            Dive deep into our curated categories, each packed with expert reviews, 
            comparisons, and recommendations tailored to your needs.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCategories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:-translate-y-1 ${category.borderColor}`}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <category.icon className="w-7 h-7 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {category.description}
                </p>

                {/* Link */}
                <div className="flex items-center text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
