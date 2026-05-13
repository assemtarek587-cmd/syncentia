import type { NextRequest } from 'next/server'

// Public-only mode: no Supabase session refresh / auth enforcement.
// This file exists only as a no-op matcher to keep Next.js routing behavior stable.
export async function proxy(_request: NextRequest) {
  return
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}

