'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

export function GoogleAdLoader() {
  useEffect(() => {
    try {
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({})
    } catch {
      // Google ads can be blocked by privacy tools; the slot should fail quietly.
    }
  }, [])

  return null
}
