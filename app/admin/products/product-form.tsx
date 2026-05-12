import { Category } from '@/lib/content'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface ProductFormValue {
  name?: string | null
  slug?: string | null
  description?: string | null
  image_url?: string | null
  affiliate_url?: string | null
  price?: string | null
  rating?: number | null
  features?: string[] | null
  pros?: string[] | null
  cons?: string[] | null
  category_id?: string | null
  is_published?: boolean | null
  is_featured?: boolean | null
}

interface ProductFormProps {
  action: (formData: FormData) => Promise<void>
  categories: Category[]
  product?: ProductFormValue
  submitLabel: string
}

export function ProductForm({ action, categories, product, submitLabel }: ProductFormProps) {
  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={product?.name || ''} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={product?.slug || ''} placeholder="auto-generated-from-name" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={product?.description || ''} rows={3} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category_id">Category</Label>
          <select
            id="category_id"
            name="category_id"
            defaultValue={product?.category_id || ''}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">Uncategorized</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="image_url">Image URL</Label>
          <Input id="image_url" name="image_url" defaultValue={product?.image_url || ''} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="price">Price (Text)</Label>
          <Input id="price" name="price" defaultValue={product?.price || ''} placeholder="$9.99/mo" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rating">Rating (0-5)</Label>
          <Input id="rating" name="rating" type="number" step="0.1" min="0" max="5" defaultValue={product?.rating || ''} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="affiliate_url">Affiliate URL</Label>
          <Input id="affiliate_url" name="affiliate_url" defaultValue={product?.affiliate_url || ''} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="features">Features (One per line)</Label>
          <Textarea id="features" name="features" defaultValue={product?.features?.join('\n') || ''} rows={5} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pros">Pros (One per line)</Label>
          <Textarea id="pros" name="pros" defaultValue={product?.pros?.join('\n') || ''} rows={5} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cons">Cons (One per line)</Label>
          <Textarea id="cons" name="cons" defaultValue={product?.cons?.join('\n') || ''} rows={5} />
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input name="is_published" type="checkbox" defaultChecked={Boolean(product?.is_published)} />
          Published
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input name="is_featured" type="checkbox" defaultChecked={Boolean(product?.is_featured)} />
          Featured
        </label>
      </div>

      <Button type="submit">{submitLabel}</Button>
    </form>
  )
}
