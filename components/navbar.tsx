'use client'

import { useState, useEffect, type FormEvent } from 'react'
import Link from 'next/link'
import { Menu, X, Search, ChevronDown, Brain, Cloud, Server, GraduationCap, Gamepad2, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SearchDialog } from '@/components/search-dialog'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const categories = [
  { name: 'AI Tools', slug: 'ai-tools', icon: Brain },
  { name: 'SaaS', slug: 'saas', icon: Cloud },
  { name: 'Hosting', slug: 'hosting', icon: Server },
  { name: 'Student Tech', slug: 'student-tech', icon: GraduationCap },
  { name: 'Gaming Setup', slug: 'gaming-setup', icon: Gamepad2 },
  { name: 'VPNs', slug: 'vpns', icon: Shield },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())

  const handleSubscribe = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedEmail = email.trim()

    if (!validateEmail(trimmedEmail)) {
      setStatus('error')
      setMessage('Please enter a valid email address.')
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail }),
      })
      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage('Thanks for subscribing!')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <nav className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center overflow-hidden group-hover:animate-glow transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-80" />
              <span className="relative text-xl font-bold text-primary-foreground">S</span>
            </div>
            <span className="text-xl font-bold gradient-text">Syncentia</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="flex items-center gap-8">
          <Link href="/" className="text-foreground/80 hover:text-foreground transition-colors">
            Home
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-foreground/80 hover:text-foreground transition-colors">
              Categories <ChevronDown className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-56 glass border-border">
              {categories.map((category) => (
                <DropdownMenuItem key={category.slug} asChild>
                  <Link href={`/category/${category.slug}`} className="flex items-center gap-3 cursor-pointer">
                    <category.icon className="w-4 h-4 text-primary" />
                    <span>{category.name}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/blog" className="text-foreground/80 hover:text-foreground transition-colors">
            Blog
          </Link>

          <Link href="/compare" className="text-foreground/80 hover:text-foreground transition-colors">
            Compare
          </Link>

          <Link href="/about" className="text-foreground/80 hover:text-foreground transition-colors">
            About
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-foreground/80 hover:text-foreground"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="w-5 h-5" />
          </Button>
          <DialogTrigger asChild>
            <Button variant="outline" className="border-primary/50 hover:bg-primary/10 hover:border-primary">
              Subscribe
            </Button>
          </DialogTrigger>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden glass mt-2 mx-4 rounded-xl p-4 animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="text-foreground/80 hover:text-foreground transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>

            <div className="border-t border-border pt-4">
              <p className="text-sm text-muted-foreground mb-3">Categories</p>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/category/${category.slug}`}
                    className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <category.icon className="w-4 h-4 text-primary" />
                    <span className="text-sm">{category.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-4 flex flex-col gap-2">
              <Link
                href="/blog"
                className="text-foreground/80 hover:text-foreground transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/compare"
                className="text-foreground/80 hover:text-foreground transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Compare
              </Link>
              <Link
                href="/about"
                className="text-foreground/80 hover:text-foreground transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              <Button
                className="w-full border border-border bg-background/70 hover:bg-background"
                onClick={() => {
                  setIsSearchOpen(true)
                  setIsMobileMenuOpen(false)
                }}
              >
                Search Syncentia
              </Button>
              <DialogTrigger asChild>
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Subscribe
                </Button>
              </DialogTrigger>
            </div>
          </div>
        </div>
      )}

      <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Subscribe to our newsletter</DialogTitle>
            <DialogDescription>
              Get the latest SaaS, hosting, and AI news straight to your inbox.
            </DialogDescription>
          </DialogHeader>
          <form className="grid gap-4 py-2" onSubmit={handleSubscribe}>
            <div className="grid gap-2">
              <label htmlFor="newsletter-email" className="text-sm text-foreground/80">
                Email address
              </label>
              <Input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  if (status !== 'idle') {
                    setStatus('idle')
                    setMessage('')
                  }
                }}
                placeholder="you@example.com"
                required
                className="w-full"
              />
            </div>

            {message ? (
              <p className={`text-sm ${status === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {message}
              </p>
            ) : null}

            <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <DialogClose asChild>
                <Button variant="ghost" type="button" className="w-full sm:w-auto">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={status === 'loading'} className="w-full sm:w-auto">
                {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </header>
  )
}
