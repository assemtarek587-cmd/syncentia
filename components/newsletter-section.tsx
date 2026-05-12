'use client'

import { useState } from 'react'
import { Mail, Sparkles, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage('Welcome aboard! Check your inbox for confirmation.')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }

    // Reset status after 5 seconds
    setTimeout(() => {
      setStatus('idle')
      setMessage('')
    }, 5000)
  }

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="w-20 h-20 rounded-2xl glass mx-auto mb-8 flex items-center justify-center animate-float">
            <Mail className="w-10 h-10 text-primary" />
          </div>

          {/* Content */}
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Stay Ahead of the <span className="gradient-text">Tech Curve</span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto text-pretty">
            Join 50,000+ tech enthusiasts. Get exclusive reviews, comparisons, 
            and deals delivered to your inbox every week.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 bg-secondary border-border focus:border-primary"
                disabled={status === 'loading' || status === 'success'}
                required
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="h-12 px-6 bg-primary hover:bg-primary/90"
              disabled={status === 'loading' || status === 'success'}
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Subscribing...
                </>
              ) : status === 'success' ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Subscribed!
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Subscribe
                </>
              )}
            </Button>
          </form>

          {/* Status Message */}
          {message && (
            <p
              className={`mt-4 text-sm ${
                status === 'success' ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {message}
            </p>
          )}

          {/* Trust Indicators */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>No spam, ever</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Unsubscribe anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Weekly digest</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
