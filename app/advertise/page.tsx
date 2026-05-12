import { Metadata } from 'next'
import { StaticPageShell } from '@/components/static-page-shell'
import { buildMetadata } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: 'Advertise',
  description: 'Advertise with Syncentia across comparison pages, articles, newsletters, and display placements.',
  path: '/advertise',
})

export default function AdvertisePage() {
  return (
    <StaticPageShell
      eyebrow="Advertise"
      title="Advertise With Syncentia"
      description="Reach readers actively comparing software, AI tools, hosting, VPNs, student tech, and gaming products."
      sections={[
        {
          title: 'Available Placements',
          body: ['Syncentia supports homepage, sidebar, in-article, footer, newsletter, and sponsored comparison placements.'],
        },
        {
          title: 'Partner Fit',
          body: ['We prioritize products that serve clear reader intent, have transparent pricing, and can be evaluated honestly by our editorial team.'],
        },
        {
          title: 'Get the Media Kit',
          body: ['Contact partnerships@syncentia.com for audience data, available inventory, sponsorship guidelines, and campaign options.'],
        },
      ]}
    />
  )
}
