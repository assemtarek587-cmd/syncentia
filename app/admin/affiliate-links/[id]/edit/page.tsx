import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { getCategories } from '@/lib/content'
import { AffiliateLinkForm } from '../../affiliate-link-form'
import { updateAffiliateLink } from '../../actions'

interface PageProps {
  params: { id: string }
}

async function getAffiliateLink(id: string) {

  const supabase = await createClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('affiliate_links')
    .select('id, title, slug, destination_url, description, cta_label, category_id, is_active, is_featured')
    .eq('id', id)
    .maybeSingle()

  if (error) return null
  return data
}

export default async function EditAffiliateLinkPage({ params }: PageProps) {
  const { id } = params

  const [affiliateLink, categories] = await Promise.all([getAffiliateLink(id), getCategories()])

  if (!affiliateLink) {
    notFound()
  }

  const action = updateAffiliateLink.bind(null, affiliateLink.id)

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/admin/affiliate-links">
          <ArrowLeft className="h-4 w-4" />
          Back to Affiliate Links
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Edit Affiliate Link</CardTitle>
        </CardHeader>
        <CardContent>
          <AffiliateLinkForm
            action={action}
            categories={categories}
            affiliateLink={affiliateLink}
            submitLabel="Save Changes"
          />
        </CardContent>
      </Card>
    </div>
  )
}
