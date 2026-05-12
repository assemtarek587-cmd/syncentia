import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AffiliateCtaProps {
  slug: string
  label?: string
  className?: string
}

export function AffiliateCta({ slug, label = 'Visit Site', className }: AffiliateCtaProps) {
  return (
    <Button className={className} asChild>
      <Link href={`/go/${slug}`} rel="nofollow sponsored">
        {label}
        <ExternalLink className="h-4 w-4" />
      </Link>
    </Button>
  )
}
