import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

// request.url used in GET; force dynamic to avoid Next prerender violations.
export const dynamic = 'force-dynamic'


// This endpoint handles Server-to-Server (S2S) postbacks from affiliate networks
// as well as client-side conversion pings.
async function processConversion(request: Request, data: Record<string, any>) {
  const cookieStore = await cookies()
  const cookieClickId = cookieStore.get('syn_attribution_click')?.value

  // Prioritize explicit click_id from the network postback, fallback to cookie
  const clickId = data.click_id || data.syn_click_id || cookieClickId
  const amount = parseFloat(data.amount) || 0
  const currency = data.currency || 'USD'
  const affiliateLinkId = data.affiliate_link_id || null
  const productId = data.product_id || null

  if (!clickId && !affiliateLinkId && !productId) {
    return NextResponse.json({ error: 'Missing attribution data' }, { status: 400 })
  }

  const supabase = await createClient()

  if (!supabase) {
    return NextResponse.json({ success: false, error: 'Supabase unavailable' }, { status: 503 })
  }

  const { error } = await supabase.from('conversions').insert({
    click_id: clickId || null,
    affiliate_link_id: affiliateLinkId,
    product_id: productId,
    amount,
    currency,
    status: 'completed'
  })

  if (error) throw error

  return NextResponse.json({ success: true, click_id: clickId, amount })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    return await processConversion(request, body)
  } catch (error) {
    console.error('Conversion tracking error (POST):', error)
    return NextResponse.json({ error: 'Failed to track conversion' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const data = Object.fromEntries(url.searchParams.entries())
    return await processConversion(request, data)
  } catch (error) {
    console.error('Conversion tracking error (GET):', error)
    return NextResponse.json({ error: 'Failed to track conversion' }, { status: 500 })
  }
}
