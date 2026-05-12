import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCategories } from '@/lib/content'
import { AffiliateLinkForm } from '../affiliate-link-form'
import { createAffiliateLink } from '../actions'

export default async function NewAffiliateLinkPage() {
  const categories = await getCategories()

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
          <CardTitle>Create Affiliate Link</CardTitle>
        </CardHeader>
        <CardContent>
          <AffiliateLinkForm action={createAffiliateLink} categories={categories} submitLabel="Create Link" />
        </CardContent>
      </Card>
    </div>
  )
}
