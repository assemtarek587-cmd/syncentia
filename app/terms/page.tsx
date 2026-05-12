import { Metadata } from 'next'
import { StaticPageShell } from '@/components/static-page-shell'
import { buildMetadata } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: 'Terms of Service',
  description: 'Terms for using Syncentia content, comparisons, and recommendations.',
  path: '/terms',
})

export default function TermsPage() {
  return (
    <StaticPageShell
      eyebrow="Legal"
      title="Terms of Service"
      description="These terms govern access to Syncentia articles, comparisons, tools, and recommendations."
      sections={[
        {
          title: 'Editorial Content',
          body: [
            'Syncentia content is provided for research and informational purposes. Product pricing, features, and availability may change after publication.',
          ],
        },
        {
          title: 'No Professional Advice',
          body: [
            'Our recommendations are not financial, legal, security, or professional procurement advice. Readers should verify products against their own needs.',
          ],
        },
        {
          title: 'Acceptable Use',
          body: [
            'Do not scrape, attack, reverse engineer, spam, or misuse Syncentia systems. We may restrict abusive traffic or account access.',
          ],
        },
        {
          title: 'Changes',
          body: ['We may update these terms as the platform, advertising systems, and affiliate programs evolve.'],
        },
      ]}
    />
  )
}
