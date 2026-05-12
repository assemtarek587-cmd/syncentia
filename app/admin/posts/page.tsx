import Link from 'next/link'
import { Edit, Plus, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { deletePost } from './actions'

function relationName(value: unknown) {
  if (Array.isArray(value)) {
    return (value[0] as { name?: string } | undefined)?.name
  }

  if (value && typeof value === 'object' && 'name' in value) {
    return (value as { name?: string }).name
  }

  return undefined
}

async function getPosts() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('posts')
    .select(
      `
      id,
      title,
      slug,
      is_published,
      created_at,
      updated_at,
      category_id,
      categories (
        name
      )
    `,
    )
    .order('created_at', { ascending: false })

  return (data || []).map((post) => ({
    ...post,
    categoryName: relationName(post.categories),
  }))
}

export default async function AdminPostsPage() {
  const posts = await getPosts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Posts</h1>
          <p className="text-muted-foreground">Manage your blog posts</p>
        </div>
        <Button asChild>
          <Link href="/admin/posts/new">
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="flex items-center justify-between gap-4 rounded-lg border p-4">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold">{post.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {post.categoryName || 'Uncategorized'} - {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={post.is_published ? 'default' : 'secondary'}>
                    {post.is_published ? 'Published' : 'Draft'}
                  </Badge>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/posts/${post.id}/edit`}>
                      <Edit className="w-4 h-4" />
                    </Link>
                  </Button>
                  <form action={deletePost}>
                    <input type="hidden" name="id" value={post.id} />
                    <Button variant="outline" size="sm" type="submit">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
