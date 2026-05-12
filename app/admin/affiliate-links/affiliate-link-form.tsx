import { Category } from '@/lib/content'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface AffiliateLinkValue {
  title?: string | null
  slug?: string | null
  destination_url?: string | null
  description?: string | null
  cta_label?: string | null
  category_id?: string | null
  is_active?: boolean | null
  is_featured?: boolean | null
}

interface AffiliateLinkFormProps {
  action: (formData: FormData) => Promise<void>
  categories: Category[]
  affiliateLink?: AffiliateLinkValue
  submitLabel: string
}

export function AffiliateLinkForm({
  action,
  categories,
  affiliateLink,
  submitLabel,
}: AffiliateLinkFormProps) {
  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" defaultValue={affiliateLink?.title || ''} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Tracking Slug</Label>
          <Input id="slug" name="slug" defaultValue={affiliateLink?.slug || ''} placeholder="product-name" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="destination_url">Destination URL</Label>
        <Input
          id="destination_url"
          name="destination_url"
          type="url"
          defaultValue={affiliateLink?.destination_url || ''}
          required
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category_id">Category</Label>
          <select
            id="category_id"
            name="category_id"
            defaultValue={affiliateLink?.category_id || ''}
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
          <Label htmlFor="cta_label">CTA Label</Label>
          <Input id="cta_label" name="cta_label" defaultValue={affiliateLink?.cta_label || 'Visit Site'} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={4} defaultValue={affiliateLink?.description || ''} />
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input name="is_active" type="checkbox" defaultChecked={affiliateLink?.is_active ?? true} />
          Active
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input name="is_featured" type="checkbox" defaultChecked={Boolean(affiliateLink?.is_featured)} />
          Featured
        </label>
      </div>

      <Button type="submit">{submitLabel}</Button>
    </form>
  )
}
