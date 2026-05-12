import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { AdForm } from '../../ad-form'
import { updateAd } from '../../actions'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getAd(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('ads')
    .select('id, name, placement, slot_id, format, label, is_active')
    .eq('id', id)
    .maybeSingle()

  if (error) return null
  return data
}

export default async function EditAdPage({ params }: PageProps) {
  const { id } = await params
  const ad = await getAd(id)

  if (!ad) {
    notFound()
  }

  const action = updateAd.bind(null, ad.id)

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/admin/ads">
          <ArrowLeft className="h-4 w-4" />
          Back to Ads
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Edit Ad Slot</CardTitle>
        </CardHeader>
        <CardContent>
          <AdForm action={action} ad={ad} submitLabel="Save Changes" />
        </CardContent>
      </Card>
    </div>
  )
}
