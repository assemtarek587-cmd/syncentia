import Link from 'next/link'
import { Edit, Plus, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { deleteAd } from './actions'

async function getAds() {
  const supabase = await createClient()
  if (!supabase) return []
  const { data } = await supabase
    .from('ads')
    .select('id, name, placement, slot_id, format, label, is_active, created_at')
    .order('created_at', { ascending: false })

  return data || []
}

export default async function AdminAdsPage() {
  const ads = await getAds()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ads</h1>
          <p className="text-muted-foreground">Configure responsive ad slots across Syncentia.</p>
        </div>
        <Button asChild>
          <Link href="/admin/ads/new">
            <Plus className="h-4 w-4" />
            New Ad
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Ad Slots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ads.map((ad) => (
              <div key={ad.id} className="flex items-center justify-between gap-4 rounded-lg border p-4">
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-semibold">{ad.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {ad.placement} - {ad.format} - {ad.slot_id || 'env fallback'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={ad.is_active ? 'default' : 'secondary'}>{ad.is_active ? 'Active' : 'Paused'}</Badge>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/ads/${ad.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <form action={deleteAd}>
                    <input type="hidden" name="id" value={ad.id} />
                    <Button variant="outline" size="sm" type="submit">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </div>
            ))}
            {ads.length === 0 && <p className="text-sm text-muted-foreground">No ad slots yet.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
