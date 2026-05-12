import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    console.error('Missing Supabase env vars for browser client')
    // Return a browser client only if env is present; otherwise throw to prevent silent misuse.
    throw new Error('Supabase environment configuration missing')
  }

  return createBrowserClient(url, anonKey)
}

