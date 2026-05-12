import { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { NewsletterSection } from '@/components/newsletter-section'
import { Button } from '@/components/ui/button'
import { Target, Users, Lightbulb, Award, ArrowRight, CheckCircle } from 'lucide-react'
import { buildMetadata } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: 'About Us',
  description: 'Learn about Syncentia - your trusted source for tech reviews, comparisons, and recommendations.',
  path: '/about',
})

const values = [
  {
    icon: Target,
    title: 'Accuracy',
    description: 'We thoroughly test and research every product we review to ensure our recommendations are reliable.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'We built Syncentia for tech enthusiasts like ourselves, prioritizing reader value over profits.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We stay at the forefront of technology to bring you the latest and most relevant insights.',
  },
  {
    icon: Award,
    title: 'Integrity',
    description: 'Our reviews are honest and unbiased. We disclose all affiliate relationships transparently.',
  },
]

const stats = [
  { value: '500+', label: 'Reviews Published' },
  { value: '50K+', label: 'Monthly Readers' },
  { value: '100+', label: 'Products Compared' },
  { value: '6', label: 'Tech Categories' },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/20 rounded-full blur-[100px]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
              About <span className="gradient-text">Syncentia</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
              We&apos;re a team of tech enthusiasts on a mission to help you navigate the 
              ever-evolving world of technology. Our goal is simple: provide honest, 
              in-depth reviews and comparisons so you can make informed decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              Our <span className="gradient-text">Story</span>
            </h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                Syncentia was born out of frustration with the tech review landscape. 
                Too many sites prioritize affiliate revenue over honest recommendations, 
                leaving readers confused and misinformed.
              </p>
              <p>
                We set out to change that. Our team of experienced tech writers, 
                developers, and enthusiasts rigorously test every product we review. 
                We use real-world scenarios, not just spec sheets, to evaluate performance.
              </p>
              <p>
                Yes, we use affiliate links - that&apos;s how we keep the lights on. But 
                our reviews are never influenced by affiliate relationships. If a product 
                isn&apos;t good, we&apos;ll tell you, even if it means losing a commission.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24 bg-card/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Our <span className="gradient-text">Values</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="glass rounded-2xl p-6 text-center hover:border-primary/50 transition-all"
              >
                <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Cover */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              What We <span className="gradient-text">Cover</span>
            </h2>
            <div className="space-y-4">
              {[
                'AI Tools - From writing assistants to image generators',
                'SaaS - Project management, CRM, and productivity tools',
                'Web Hosting - Shared, VPS, cloud, and dedicated servers',
                'Student Tech - Laptops, tablets, and study apps',
                'Gaming Setups - Hardware, peripherals, and accessories',
                'VPNs - Privacy, security, and streaming solutions',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 glass rounded-xl p-4">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to <span className="gradient-text">Explore?</span>
            </h2>
            <p className="text-muted-foreground mb-8">
              Dive into our reviews and comparisons to find the perfect tech for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                <Link href="/blog">
                  Read Our Blog
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/compare">
                  Compare Products
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <NewsletterSection />
      <Footer />
    </main>
  )
}
