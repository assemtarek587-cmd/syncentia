import { BookOpen, Sparkles } from 'lucide-react'

export function BlogHero() {
  return (
    <section className="relative pt-32 pb-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
      <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-accent/20 rounded-full blur-[80px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground/80">Tech Insights & Reviews</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
            The <span className="gradient-text">Syncentia</span> Blog
          </h1>

          {/* Description */}
          <p className="text-lg text-muted-foreground max-w-xl mx-auto text-pretty">
            Expert reviews, detailed comparisons, and comprehensive guides to help you 
            navigate the ever-evolving tech landscape.
          </p>

          {/* Stats */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
            {[
              { value: '500+', label: 'Articles' },
              { value: '50K+', label: 'Readers' },
              { value: '6', label: 'Categories' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Element */}
      <div className="absolute top-1/2 right-10 w-16 h-16 glass rounded-xl flex items-center justify-center animate-float opacity-60 hidden lg:flex">
        <Sparkles className="w-6 h-6 text-primary" />
      </div>
    </section>
  )
}
