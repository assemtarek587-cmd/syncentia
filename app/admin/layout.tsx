import { AdminSidebar } from '@/components/admin-sidebar'
import { requireAdmin } from '@/lib/admin-auth'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdmin()

  return (
    <div className="min-h-screen flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8 bg-background">
        {children}
      </main>
    </div>
  )
}
