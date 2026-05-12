import { createClient } from '@/lib/supabase/server'
import { cn } from '@/lib/utils'
import { GoogleAdLoader } from '@/components/google-ad-loader'

type AdPlacement = 'home-top' | 'sidebar' | 'in-article' | 'footer'

interface AdSlotProps {
  placement: AdPlacement
  className?: string
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
}

const envSlotByPlacement: Record<AdPlacement, string | undefined> = {
  'home-top': process.env.NEXT_PUBLIC_ADSENSE_HOME_SLOT,
  sidebar: process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT,
  'in-article': process.env.NEXT_PUBLIC_ADSENSE_IN_ARTICLE_SLOT,
  footer: process.env.NEXT_PUBLIC_ADSENSE_FOOTER_SLOT,
}

async function getConfiguredAd(placement: AdPlacement) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('ads')
    .select('slot_id, format, label')
    .eq('placement', placement)
    .eq('is_active', true)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) return null
  return data
}

export async function AdSlot({ placement, className, format = 'auto' }: AdSlotProps) {
  const configuredAd = await getConfiguredAd(placement)
  const client = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT
  const slot = configuredAd?.slot_id || envSlotByPlacement[placement]
  const resolvedFormat = configuredAd?.format || format

  return (
    <aside
      className={cn(
        'w-full overflow-hidden rounded-xl border border-border bg-card/60 p-3 text-center',
        className,
      )}
      aria-label={configuredAd?.label || 'Advertisement'}
    >
      <div className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">
        {configuredAd?.label || 'Advertisement'}
      </div>
      {client && slot ? (
        <>
          <ins
            className="adsbygoogle block min-h-24"
            data-ad-client={client}
            data-ad-slot={slot}
            data-ad-format={resolvedFormat}
            data-full-width-responsive="true"
          />
          <GoogleAdLoader />
        </>
      ) : (
        <div className="flex min-h-24 items-center justify-center rounded-lg bg-secondary/50 text-xs text-muted-foreground">
          Sponsored placement
        </div>
      )}
    </aside>
  )
}
