import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { buildMetadata, siteConfig } from '@/lib/site'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  ...buildMetadata(),
  metadataBase: new URL(siteConfig.url),
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#110f1c',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const adsenseClient = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen bg-background`}
      >
        {children}
        {adsenseClient && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
