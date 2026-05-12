import { Metadata } from 'next'
import { StaticPageShell } from '@/components/static-page-shell'
import { buildMetadata } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: 'Affiliate Disclaimer',
  description: 'Syncentia affiliate and advertising disclosure.',
  path: '/disclaimer',
})

export default function DisclaimerPage() {
  return (
    <StaticPageShell
      eyebrow="Disclosure"
      title="Affiliate Disclaimer"
      description="Syncentia uses affiliate links and advertising to fund independent research, comparisons, and guides."
      sections={[
        {
          title: 'Affiliate Links',
          body: [
            'Some outbound links are affiliate links. If you purchase through those links, Syncentia may earn a commission at no additional cost to you.',
          ],
        },
        {
          title: 'Sponsored Content',
          body: ['Sponsored placements and advertisements are labeled. Sponsorship does not give brands control over independent editorial conclusions.'],
        },
        {
          title: 'Editorial Independence',
          body: ['We aim to recommend products based on usefulness, reliability, pricing, audience fit, and practical testing criteria.'],
        },
      ]}
    />
  )
}
