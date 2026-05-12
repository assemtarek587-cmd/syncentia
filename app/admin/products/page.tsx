import Link from 'next/link'
import { Edit, Plus, Star, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { deleteProduct } from './actions'

function relationName(value: unknown) {
  if (Array.isArray(value)) {
    return (value[0] as { name?: string } | undefined)?.name
  }

  if (value && typeof value === 'object' && 'name' in value) {
    return (value as { name?: string }).name
  }

  return undefined
}

async function getProducts() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('products')
    .select(
      `
      id,
      name,
      slug,
      is_published,
      price,
      rating,
      created_at,
      category_id,
      categories (
        name
      )
    `,
    )
    .order('created_at', { ascending: false })

  return (data || []).map((product) => ({
    ...product,
    categoryName: relationName(product.categories),
  }))
}

export default async function AdminProductsPage() {
  const products = await getProducts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage comparison products.</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="w-4 h-4 mr-2" />
            New Product
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="flex items-center justify-between gap-4 rounded-lg border p-4">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold">{product.name}</h3>
                  <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span>{product.categoryName || 'Uncategorized'}</span>
                    <span>-</span>
                    <span>{product.price || 'No price'}</span>
                    {product.rating && (
                      <>
                        <span>-</span>
                        <span className="inline-flex items-center gap-1">
                          {product.rating}/5 <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        </span>
                      </>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={product.is_published ? 'default' : 'secondary'}>
                    {product.is_published ? 'Published' : 'Draft'}
                  </Badge>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/products/${product.id}/edit`}>
                      <Edit className="w-4 h-4" />
                    </Link>
                  </Button>
                  <form action={deleteProduct}>
                    <input type="hidden" name="id" value={product.id} />
                    <Button variant="outline" size="sm" type="submit">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </div>
            ))}
            {products.length === 0 && <p className="text-sm text-muted-foreground">No products yet.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
