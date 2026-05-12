import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getCategories } from '@/lib/content'
import { ProductForm } from '../product-form'
import { createProduct } from '../actions'

export default async function NewProductPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/admin/products">
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Create Product</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm action={createProduct} categories={categories} submitLabel="Create Product" />
        </CardContent>
      </Card>
    </div>
  )
}
