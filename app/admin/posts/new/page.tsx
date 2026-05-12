import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getCategories } from '@/lib/content'
import { PostForm } from '../post-form'
import { createPost } from '../actions'

export default async function NewPostPage() {
  const categories = await getCategories()

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
          <CardTitle>Create Post</CardTitle>
        </CardHeader>
        <CardContent>
          <PostForm action={createPost} categories={categories} submitLabel="Create Post" />
        </CardContent>
      </Card>
    </div>
  )
}
