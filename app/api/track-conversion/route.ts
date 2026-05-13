import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

function normalizeSlug(input: unknown): string | null {
  if (typeof input !== 'string') return null
  const s = input.trim().toLowerCase()
  return s.length ? s : null
}

async function processAttribution(data: Record<string, any>) {
  const supabase = await createClient()

  const slug = normalizeSlug(data.slug)
  if (!slug) {
    return NextResponse.json({ error: 'Missing required field: slug' }, { status: 400 })
  }

  const affiliateLinkId = data.affiliate_link_id ?? null
  const productId = data.product_id ?? null

  const referrer = typeof data.referrer === 'string' ? data.referrer : null
  const userAgent = typeof data.user_agent === 'string' ? data.user_agent.slice(0, 500) : null

  const utm_source = typeof data.utm_source === 'string' ? data.utm_source : null
  const utm_medium = typeof data.utm_medium === 'string' ? data.utm_medium : null
  const utm_campaign = typeof data.utm_campaign === 'string' ? data.utm_campaign : null

  const { error } = await supabase.from('affiliate_clicks').insert({
    slug,
    affiliate_link_id: affiliateLinkId,
    product_id: productId,
    referrer,
    user_agent: userAgent,
    utm_source,
    utm_medium,
    utm_campaign,
  })

  if (error) {
    console.error('Attribution insert error:', error)
    return NextResponse.json({ error: 'Failed to record attribution' }, { status: 500 })
  }

  return NextResponse.json({ success: true, slug }, { status: 200 })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    return await processAttribution(body ?? {})
  } catch (error) {
    console.error('track-conversion POST error:', error)
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const data = Object.fromEntries(url.searchParams.entries())
    return await processAttribution(data)
  } catch (error) {
    console.error('track-conversion GET error:', error)
    return NextResponse.json({ error: 'Invalid query params' }, { status: 400 })
  }
}

