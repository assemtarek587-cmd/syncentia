import { Metadata } from 'next'
import { StaticPageShell } from '@/components/static-page-shell'
import { buildMetadata } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy',
  description: 'How Syncentia collects, uses, and protects reader data.',
  path: '/privacy-policy',
})

export default function PrivacyPolicyPage() {
  return (
    <StaticPageShell
      eyebrow="Legal"
      title="Privacy Policy"
      description="This policy explains how Syncentia handles reader information, analytics, newsletter subscriptions, affiliate clicks, and advertising data."
      sections={[
        {
          title: 'Information We Collect',
          body: [
            'We may collect newsletter email addresses, basic analytics events, affiliate click metadata, and information readers provide when contacting us.',
            'Affiliate click records are used to measure monetization performance and improve recommendations.',
          ],
        },
        {
          title: 'How We Use Information',
          body: [
            'We use collected information to operate the site, send requested emails, measure content performance, prevent abuse, and improve editorial quality.',
          ],
        },
        {
          title: 'Third-Party Services',
          body: [
            'Syncentia may use Supabase, Vercel Analytics, Google advertising products, and affiliate networks. Those providers process data under their own policies.',
          ],
        },
        {
          title: 'Your Choices',
          body: [
            'Newsletter subscribers can unsubscribe at any time. Readers can also use browser privacy controls to limit cookies, ads personalization, and analytics.',
          ],
        },
      ]}
    />
  )
}
