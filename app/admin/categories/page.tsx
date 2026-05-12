import { Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { getCategories } from '@/lib/content'
import { createCategory, deleteCategory } from './actions'

export default async function AdminCategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Categories</h1>
        <p className="text-muted-foreground">Manage SEO content categories.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Category</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createCategory} className="grid gap-4 lg:grid-cols-[1fr_1fr_2fr_auto]">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" placeholder="auto-generated" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={1} />
            </div>
            <div className="flex items-end">
              <Button type="submit">Create</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between gap-4 rounded-lg border p-4">
                <div className="min-w-0">
                  <h2 className="font-semibold">{category.name}</h2>
                  <p className="text-sm text-muted-foreground">/{category.slug}</p>
                  {category.description && <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>}
                </div>
                <form action={deleteCategory}>
                  <input type="hidden" name="id" value={category.id} />
                  <Button variant="outline" size="sm" type="submit">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            ))}
            {categories.length === 0 && <p className="text-sm text-muted-foreground">No categories yet.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
