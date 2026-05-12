import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

interface StaticSection {
  title: string
  body: string[]
}

interface StaticPageShellProps {
  title: string
  eyebrow: string
  description: string
  sections: StaticSection[]
}

export function StaticPageShell({ title, eyebrow, description, sections }: StaticPageShellProps) {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="relative overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute left-1/4 top-1/3 h-80 w-80 rounded-full bg-primary/20 blur-[130px]" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm uppercase tracking-wider text-primary">{eyebrow}</p>
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">
              <span className="gradient-text">{title}</span>
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground">{description}</p>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl space-y-8">
            {sections.map((section) => (
              <section key={section.title} className="border-b border-border pb-8 last:border-0">
                <h2 className="mb-4 text-2xl font-semibold">{section.title}</h2>
                <div className="space-y-4 text-muted-foreground">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
