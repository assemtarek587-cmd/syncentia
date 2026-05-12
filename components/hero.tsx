'use client'

import { ArrowRight, Sparkles, Zap, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse delay-1000" />
      
      {/* Floating Elements */}
      <div className="absolute top-1/3 left-10 w-20 h-20 glass rounded-2xl flex items-center justify-center animate-float opacity-60">
        <Sparkles className="w-8 h-8 text-primary" />
      </div>
      <div className="absolute top-1/2 right-16 w-16 h-16 glass rounded-xl flex items-center justify-center animate-float delay-500 opacity-60">
        <Zap className="w-6 h-6 text-accent" />
      </div>
      <div className="absolute bottom-1/3 left-1/4 w-14 h-14 glass rounded-lg flex items-center justify-center animate-float delay-1000 opacity-60">
        <TrendingUp className="w-5 h-5 text-primary" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8 animate-pulse-border border">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground/80">Discover the Future of Tech</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-balance">
            <span className="text-foreground">Future-Proof</span>
            <br />
            <span className="gradient-text">Your Tech Stack</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed text-pretty">
            Expert reviews, in-depth comparisons, and curated recommendations for AI tools, 
            SaaS platforms, hosting solutions, and everything tech enthusiasts need.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg group animate-glow"
              asChild
            >
              <Link href="/blog">
                Explore Articles
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-border hover:bg-secondary px-8 py-6 text-lg"
              asChild
            >
              <Link href="/compare">
                Compare Products
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '500+', label: 'Reviews' },
              { value: '50K+', label: 'Monthly Readers' },
              { value: '6', label: 'Categories' },
              { value: '100+', label: 'Comparisons' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
