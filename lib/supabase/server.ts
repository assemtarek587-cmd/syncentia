import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Especially important if using Fluid compute: Don't put this client in a
 * global variable. Always create a new client within each function when using
 * it.
 */
type SupabaseEnv = {
  url: string
  anonKey: string
}

function getSupabaseEnv(): SupabaseEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    console.warn(
      'Supabase env vars missing: NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY',
    )
    return null
  }

  return { url, anonKey }
}

export async function createClient() {
  const cookieStore = await cookies()
  const env = getSupabaseEnv()

  if (!env) {
    // Build/runtime-safe behavior: keep pages/API from crashing if Supabase is misconfigured.
    // eslint-disable-next-line no-console
    console.warn('Supabase env not configured; using null client')
    return null
  }

  const { url, anonKey } = env

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Ignore setAll failures when called from Server Components.
        }
      },
    },
  })
}

