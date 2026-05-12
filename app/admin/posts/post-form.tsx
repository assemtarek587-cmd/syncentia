import { Category } from '@/lib/content'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface PostFormValue {
  title?: string | null
  slug?: string | null
  excerpt?: string | null
  content?: string | null
  featured_image?: string | null
  category_id?: string | null
  is_published?: boolean | null
  is_featured?: boolean | null
}

interface PostFormProps {
  action: (formData: FormData) => Promise<void>
  categories: Category[]
  post?: PostFormValue
  submitLabel: string
}

export function PostForm({ action, categories, post, submitLabel }: PostFormProps) {
  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" defaultValue={post?.title || ''} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={post?.slug || ''} placeholder="auto-generated-from-title" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea id="excerpt" name="excerpt" defaultValue={post?.excerpt || ''} rows={3} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category_id">Category</Label>
          <select
            id="category_id"
            name="category_id"
            defaultValue={post?.category_id || ''}
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
          <Label htmlFor="featured_image">Featured Image URL</Label>
          <Input id="featured_image" name="featured_image" defaultValue={post?.featured_image || ''} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea id="content" name="content" defaultValue={post?.content || ''} rows={18} />
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input name="is_published" type="checkbox" defaultChecked={Boolean(post?.is_published)} />
          Published
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input name="is_featured" type="checkbox" defaultChecked={Boolean(post?.is_featured)} />
          Featured
        </label>
      </div>

      <Button type="submit">{submitLabel}</Button>
    </form>
  )
}
