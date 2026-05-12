import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { getCategories } from '@/lib/content'
import { PostForm } from '../../post-form'
import { updatePost } from '../../actions'

interface PageProps {
  params: { id: string }
}

async function getPost(id: string) {


  const supabase = await createClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, content, featured_image, category_id, is_published, is_featured')
    .eq('id', id)
    .maybeSingle()

  if (error) return null
  return data
}

export default async function EditPostPage({ params }: PageProps) {
  const { id } = params

  const [post, categories] = await Promise.all([getPost(id), getCategories()])

  if (!post) {
    notFound()
  }

  const action = updatePost.bind(null, post.id)

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/admin/posts">
          <ArrowLeft className="h-4 w-4" />
          Back to Posts
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Edit Post</CardTitle>
        </CardHeader>
        <CardContent>
          <PostForm action={action} categories={categories} post={post} submitLabel="Save Changes" />
        </CardContent>
      </Card>
    </div>
  )
}
