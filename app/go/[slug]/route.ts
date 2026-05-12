import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

interface AffiliateTarget {
  id: string
  slug: string
  destination_url: string
  source: 'affiliate_links' | 'products'
}

function safeFallbackRedirect(request: NextRequest) {
  return NextResponse.redirect(new URL('/compare', request.url), { status: 302 })
}

async function resolveTarget(slug: string): Promise<AffiliateTarget | null> {
  const supabase = await createClient()

  const { data: affiliateLink } = await supabase
    .from('affiliate_links')
    .select('id, slug, destination_url')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()

  if (affiliateLink?.destination_url) {
    return {
      id: affiliateLink.id,
      slug: affiliateLink.slug,
      destination_url: affiliateLink.destination_url,
      source: 'affiliate_links',
    }
  }

  const { data: product } = await supabase
    .from('products')
    .select('id, slug, affiliate_url')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle()

  if (product?.affiliate_url) {
    return {
      id: product.id,
      slug: product.slug,
      destination_url: product.affiliate_url,
      source: 'products',
    }
  }

  return null
}

function getDeviceType(userAgent: string): string {
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
    return 'tablet'
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
    return 'mobile'
  }
  return 'desktop'
}

async function trackClick(request: NextRequest, target: AffiliateTarget) {
  const supabase = await createClient()
  const url = request.nextUrl
  const cookieStore = await cookies()
  
  const userAgent = request.headers.get('user-agent') || ''
  const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  const country = request.headers.get('x-vercel-ip-country') || 'unknown'
  const deviceType = getDeviceType(userAgent)

  // Advanced Anti-Fraud: Ignore obvious bots and crawlers
  if (/bot|crawler|spider|crawling|googlebot|bingbot|yandexbot|duckduckbot/i.test(userAgent)) {
    return null
  }

  // Persistent Session tracking
  let sessionId = cookieStore.get('syn_session_id')?.value
  if (!sessionId) {
    sessionId = crypto.randomUUID()
  }

  // Duplicate click suppression (Check if same IP + target clicked in last 5 mins)
  const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
  const { data: recentClicks } = await supabase
    .from('affiliate_clicks')
    .select('id')
    .eq('ip_address', ipAddress)
    .eq('slug', target.slug)
    .gte('created_at', fiveMinsAgo)
    .limit(1)

  if (recentClicks && recentClicks.length > 0) {
    // Duplicate suppressed, do not record another click
    return null
  }

  const { data: clickData, error } = await supabase.from('affiliate_clicks').insert({
    affiliate_link_id: target.source === 'affiliate_links' ? target.id : null,
    product_id: target.source === 'products' ? target.id : null,
    slug: target.slug,
    referrer: request.headers.get('referer'),
    user_agent: userAgent.slice(0, 500),
    ip_address: ipAddress,
    country: country,
    device_type: deviceType,
    utm_source: url.searchParams.get('utm_source'),
    utm_medium: url.searchParams.get('utm_medium'),
    utm_campaign: url.searchParams.get('utm_campaign'),
  }).select('id').single()

  if (error) {
    console.error('Tracking error:', error)
    return null
  }

  return { clickId: clickData.id, sessionId }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const target = await resolveTarget(slug)

  if (!target) {
    return safeFallbackRedirect(request)
  }

  let finalUrl = target.destination_url
  let trackingResult = null

  try {
    trackingResult = await trackClick(request, target)
    
    if (trackingResult) {
      // S2S Tracking: Inject the Click ID into the destination URL
      // If the admin used the [CLICK_ID] macro, replace it. Otherwise, append it as a query param.
      if (finalUrl.includes('[CLICK_ID]')) {
        finalUrl = finalUrl.replace(/\[CLICK_ID\]/g, trackingResult.clickId)
      } else {
        const urlObj = new URL(finalUrl)
        urlObj.searchParams.set('syn_click_id', trackingResult.clickId)
        finalUrl = urlObj.toString()
      }
    }
  } catch (error) {
    console.error('Failed to track affiliate click:', error)
  }

  const response = NextResponse.redirect(finalUrl, { status: 302 })

  if (trackingResult) {
    // Set 30-day attribution cookie for fallback conversion tracking
    response.cookies.set('syn_attribution_click', trackingResult.clickId, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })
    
    // Set persistent session cookie
    response.cookies.set('syn_session_id', trackingResult.sessionId, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })
  }

  return response
}
