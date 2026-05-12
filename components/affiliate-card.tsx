import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface AffiliateCardProps {
  title: string
  slug: string
  description?: string | null
  category?: string | null
  ctaLabel?: string | null
  featured?: boolean
}

export function AffiliateCard({
  title,
  slug,
  description,
  category,
  ctaLabel,
  featured = false,
}: AffiliateCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/50">
      <div className="mb-4 flex items-center justify-between gap-3">
        {category ? <Badge variant="outline">{category}</Badge> : <span />}
        {featured && <Badge>Featured</Badge>}
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      {description && <p className="mb-5 line-clamp-3 text-sm text-muted-foreground">{description}</p>}
      <div className="flex gap-2">
        <Button size="sm" asChild>
          <Link href={`/go/${slug}`} rel="nofollow sponsored">
            {ctaLabel || 'Visit Site'}
            <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
        <Button size="sm" variant="outline" asChild>
          <Link href="/advertise">
            Advertise
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
