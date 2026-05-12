import { Metadata } from 'next'
import { StaticPageShell } from '@/components/static-page-shell'
import { buildMetadata } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: 'FAQ',
  description: 'Frequently asked questions about Syncentia reviews, affiliate links, ads, and recommendations.',
  path: '/faq',
})

export default function FaqPage() {
  return (
    <StaticPageShell
      eyebrow="FAQ"
      title="Frequently Asked Questions"
      description="Quick answers about how Syncentia researches products, earns revenue, and keeps recommendations useful."
      sections={[
        {
          title: 'How does Syncentia make money?',
          body: ['Syncentia may earn affiliate commissions, sponsorship revenue, and advertising revenue. We disclose monetized links and placements clearly.'],
        },
        {
          title: 'Do affiliate links affect rankings?',
          body: ['Affiliate relationships do not guarantee favorable coverage. Editorial quality, product fit, pricing, performance, and reader value drive recommendations.'],
        },
        {
          title: 'Can brands request a review?',
          body: ['Yes. Brands can contact partnerships@syncentia.com. A request does not guarantee coverage or a positive placement.'],
        },
        {
          title: 'How often is content updated?',
          body: ['High-value guides and comparisons are reviewed periodically, with priority given to fast-moving categories such as AI tools, SaaS, hosting, and VPNs.'],
        },
      ]}
    />
  )
}
