import Link from 'next/link'
import { Edit, Plus, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { deleteAffiliateLink } from './actions'

async function getAffiliateLinks() {
  const supabase = await createClient()
  if (!supabase) {
    return []
  }
  const [{ data: links }, { data: clicks }] = await Promise.all([
    supabase
      .from('affiliate_links')
      .select('id, title, slug, destination_url, is_active, is_featured, created_at, categories(name)')
      .order('created_at', { ascending: false }),
    supabase.from('affiliate_clicks').select('affiliate_link_id'),
  ])

  const clickCounts = new Map<string, number>()
  ;(clicks || []).forEach((click) => {
    if (click.affiliate_link_id) {
      clickCounts.set(click.affiliate_link_id, (clickCounts.get(click.affiliate_link_id) || 0) + 1)
    }
  })

  return (links || []).map((link) => ({
    ...link,
    clicks: clickCounts.get(link.id) || 0,
  }))
}

export default async function AdminAffiliateLinksPage() {
  const links = await getAffiliateLinks()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Affiliate Links</h1>
          <p className="text-muted-foreground">Manage tracked outbound monetization links.</p>
        </div>
        <Button asChild>
          <Link href="/admin/affiliate-links/new">
            <Plus className="h-4 w-4" />
            New Link
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Affiliate Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {links.map((link) => (
              <div key={link.id} className="flex items-center justify-between gap-4 rounded-lg border p-4">
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-semibold">{link.title}</h2>
                  <p className="truncate text-sm text-muted-foreground">/go/{link.slug}</p>
                  <p className="truncate text-xs text-muted-foreground">{link.destination_url}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={link.is_active ? 'default' : 'secondary'}>{link.is_active ? 'Active' : 'Paused'}</Badge>
                  {link.is_featured && <Badge variant="outline">Featured</Badge>}
                  <Badge variant="outline">{link.clicks} clicks</Badge>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/affiliate-links/${link.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <form action={deleteAffiliateLink}>
                    <input type="hidden" name="id" value={link.id} />
                    <Button variant="outline" size="sm" type="submit">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </div>
            ))}
            {links.length === 0 && <p className="text-sm text-muted-foreground">No affiliate links yet.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
