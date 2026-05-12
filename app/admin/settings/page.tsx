import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminSettingsPage() {
  const settings = [
    {
      name: 'Supabase URL',
      value: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configured' : 'Missing',
    },
    {
      name: 'Supabase anon key',
      value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Configured' : 'Missing',
    },
    {
      name: 'Site URL',
      value: process.env.NEXT_PUBLIC_SITE_URL || 'Using default https://syncentia.com',
    },
    {
      name: 'Resend API Key (Emails)',
      value: process.env.RESEND_API_KEY ? 'Configured' : 'Missing (Emails disabled)',
    },
    {
      name: 'Google AdSense client',
      value: process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT ? 'Configured' : 'Optional',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Operational configuration and environment readiness.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Environment Variables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {settings.map((setting) => (
              <div key={setting.name} className="flex items-center justify-between gap-4 py-4">
                <span className="font-medium">{setting.name}</span>
                <span className={`text-sm ${setting.value.includes('Missing') ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {setting.value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Affiliate Postback (S2S Tracking)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-sm text-muted-foreground">
          <p>
            To track revenue accurately in the dashboard, configure your affiliate networks (Impact, CJ, ShareASale, etc.) to use Server-to-Server (S2S) postbacks.
          </p>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground text-base">1. Pass the Click ID</h3>
            <p>Add the <code className="bg-muted px-1.5 py-0.5 rounded text-primary">[CLICK_ID]</code> macro to your Affiliate Links in Syncentia. We will automatically replace it with a unique tracking ID when a user clicks.</p>
            <p className="mt-2">Example Destination URL:<br/>
              <code className="block mt-1 bg-muted p-2 rounded text-foreground break-all">
                https://partner.com/track?aff_id=123&subid=[CLICK_ID]
              </code>
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-foreground text-base">2. Configure the Postback URL</h3>
            <p>Set this URL as your global postback/webhook in your affiliate network dashboard:</p>
            <code className="block mt-1 bg-muted p-3 rounded-md text-foreground break-all">
              {process.env.NEXT_PUBLIC_SITE_URL || 'https://syncentia.com'}/api/track-conversion?click_id={'{subid}'}&amount={'{sale_amount}'}&currency=USD
            </code>
            <p className="text-xs mt-2">
              Note: Replace <code className="text-foreground">{'{subid}'}</code> and <code className="text-foreground">{'{sale_amount}'}</code> with the specific macros used by your affiliate network.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Database Contract</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>Admin access is controlled by `profiles.is_admin`; only authorized users should have that flag enabled.</p>
          <p>All database interactions are secured via Row Level Security (RLS). Public users can only read published content.</p>
        </CardContent>
      </Card>
    </div>
  )
}
