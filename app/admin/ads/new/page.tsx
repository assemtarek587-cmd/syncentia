import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AdForm } from '../ad-form'
import { createAd } from '../actions'

export default function NewAdPage() {
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
          <CardTitle>Create Ad Slot</CardTitle>
        </CardHeader>
        <CardContent>
          <AdForm action={createAd} submitLabel="Create Ad" />
        </CardContent>
      </Card>
    </div>
  )
}
