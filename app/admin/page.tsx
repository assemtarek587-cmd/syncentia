import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Link2, Mail, Megaphone, MousePointerClick, Package, DollarSign, Target, Monitor, Smartphone, Tablet, Activity} from 'lucide-react'

async function getStats() {
  const supabase = await createClient()

  // `conversions` table is not present in the current `supabase/schema.sql`.
  // Keep admin dashboard stable by excluding it from queries.
  const [
    postsResult,
    productsResult,
    subscribersResult,
    affiliateLinksResult,
    clicksResult,
    adsResult
  ] = await Promise.all([
    supabase.from('posts').select('id', { count: 'exact', head: true }),
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('newsletter_subscribers').select('id', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('affiliate_links').select('id', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('affiliate_clicks').select('id', { count: 'exact', head: true }),
    supabase.from('ads').select('id', { count: 'exact', head: true }).eq('is_active', true),
  ])

  return {
    posts: postsResult.count || 0,
    products: productsResult.count || 0,
    subscribers: subscribersResult.count || 0,
    affiliateLinks: affiliateLinksResult.count || 0,
    clicks: clicksResult.count || 0,
    ads: adsResult.count || 0,
    conversions: 0,
    revenue: 0,
  }
}


async function getDeviceStats() {
  // device_type is not present in the current `supabase/schema.sql` for affiliate_clicks.
  // Return zeros so the admin dashboard cannot crash due to schema mismatch.
  return { mobile: 0, desktop: 0, tablet: 0 }
}


async function getRecentPosts() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('posts')
    .select('id, title, is_published, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  return data || []
}

async function getRecentSubscribers() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('newsletter_subscribers')
    .select('id, email, subscribed_at')
    .order('subscribed_at', { ascending: false })
    .limit(5)

  return data || []
}

export default async function AdminDashboard() {
  const [stats, deviceStats, recentPosts, recentSubscribers] = await Promise.all([
    getStats(),
    getDeviceStats(),
    getRecentPosts(),
    getRecentSubscribers(),
  ])

  const ctr = stats.clicks > 0 ? ((stats.conversions / stats.clicks) * 100).toFixed(2) : '0.00'

  const statsCards = [
    { title: 'Total Revenue', value: `$${stats.revenue.toFixed(2)}`, icon: DollarSign, color: 'text-green-400' },
    { title: 'Conversions', value: stats.conversions, icon: Target, color: 'text-emerald-400' },
    { title: 'Tracked Clicks', value: stats.clicks, icon: MousePointerClick, color: 'text-amber-400' },
    { title: 'Avg. Conv. Rate', value: `${ctr}%`, icon: Activity, color: 'text-cyan-400' },
    { title: 'Total Posts', value: stats.posts, icon: FileText, color: 'text-blue-400' },
    { title: 'Total Products', value: stats.products, icon: Package, color: 'text-indigo-400' },
    { title: 'Affiliate Links', value: stats.affiliateLinks, icon: Link2, color: 'text-purple-400' },
    { title: 'Active Subscribers', value: stats.subscribers, icon: Mail, color: 'text-pink-400' },
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Business Intelligence</h1>
        <p className="text-muted-foreground">Monitor platform growth, revenue, and content performance.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Device Breakdown */}
        <Card className="bg-card border-border lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-primary" />
              Traffic by Device
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Desktop</span>
                </div>
                <span className="text-sm font-bold">{deviceStats.desktop}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Mobile</span>
                </div>
                <span className="text-sm font-bold">{deviceStats.mobile}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tablet className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Tablet</span>
                </div>
                <span className="text-sm font-bold">{deviceStats.tablet}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Posts */}
        <Card className="bg-card border-border lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Recent Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentPosts.length > 0 ? (
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="font-medium text-sm line-clamp-1">{post.title}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(post.created_at)}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      post.is_published
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {post.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No posts yet. Create your first post!</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Subscribers */}
        <Card className="bg-card border-border lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              New Subscribers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentSubscribers.length > 0 ? (
              <div className="space-y-4">
                {recentSubscribers.map((subscriber) => (
                  <div key={subscriber.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="font-medium text-sm">{subscriber.email}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(subscriber.subscribed_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No subscribers yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
