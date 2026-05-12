import { Metadata } from 'next'
import { StaticPageShell } from '@/components/static-page-shell'
import { buildMetadata } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: 'Contact',
  description: 'Contact Syncentia for editorial, partnership, advertising, and support inquiries.',
  path: '/contact',
})

export default function ContactPage() {
  return (
    <StaticPageShell
      eyebrow="Contact"
      title="Contact Syncentia"
      description="Reach the Syncentia team for editorial questions, partnership requests, advertising opportunities, and reader feedback."
      sections={[
        {
          title: 'Editorial',
          body: ['Send product review pitches, corrections, and research notes to editorial@syncentia.com.'],
        },
        {
          title: 'Partnerships',
          body: ['For affiliate, sponsorship, and media kit requests, contact partnerships@syncentia.com.'],
        },
        {
          title: 'Reader Support',
          body: ['For general questions about a guide, comparison, or recommendation, contact support@syncentia.com.'],
        },
      ]}
    />
  )
}
