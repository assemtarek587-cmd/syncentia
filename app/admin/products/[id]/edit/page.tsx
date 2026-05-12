import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { getCategories } from '@/lib/content'
import { ProductForm } from '../../product-form'
import { updateProduct } from '../../actions'

interface PageProps {
  params: { id: string }
}

async function getProduct(id: string) {


  const supabase = await createClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) return null
  return data
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = params

  const [product, categories] = await Promise.all([getProduct(id), getCategories()])

  if (!product) {
    notFound()
  }

  const action = updateProduct.bind(null, product.id)

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
          <CardTitle>Edit Product</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm action={action} categories={categories} product={product} submitLabel="Save Changes" />
        </CardContent>
      </Card>
    </div>
  )
}
