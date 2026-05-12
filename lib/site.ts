import type { Metadata } from 'next'

export const siteConfig = {
  name: 'Syncentia',
  description:
    'Expert reviews, comparisons, and buying guides for AI tools, SaaS, hosting, VPNs, student tech, and gaming setups.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://syncentia.com',
}

export function absoluteUrl(path = '/') {
  return new URL(path, siteConfig.url).toString()
}

export function buildMetadata({
  title,
  description = siteConfig.description,
  path = '/',
}: {
  title?: string
  description?: string
  path?: string
} = {}): Metadata {
  const resolvedTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name

  return {
    title: resolvedTitle,
    description,
    alternates: {
      canonical: absoluteUrl(path),
    },
    openGraph: {
      title: resolvedTitle,
      description,
      url: absoluteUrl(path),
      siteName: siteConfig.name,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description,
    },
  }
}
