import Link from 'next/link'
import { Brain, Cloud, Server, GraduationCap, Gamepad2, Shield, Twitter, Github, Linkedin, Youtube } from 'lucide-react'
import { AdSlot } from '@/components/ad-slot'

const categories = [
  { name: 'AI Tools', slug: 'ai-tools', icon: Brain },
  { name: 'SaaS', slug: 'saas', icon: Cloud },
  { name: 'Hosting', slug: 'hosting', icon: Server },
  { name: 'Student Tech', slug: 'student-tech', icon: GraduationCap },
  { name: 'Gaming Setup', slug: 'gaming-setup', icon: Gamepad2 },
  { name: 'VPNs', slug: 'vpns', icon: Shield },
]

const quickLinks = [
  { name: 'Home', href: '/' },
  { name: 'Blog', href: '/blog' },
  { name: 'Compare Products', href: '/compare' },
  { name: 'About Us', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

const legalLinks = [
  { name: 'Privacy Policy', href: '/privacy-policy' },
  { name: 'Terms of Service', href: '/terms' },
  { name: 'Affiliate Disclaimer', href: '/disclaimer' },
  { name: 'Advertise', href: '/advertise' },
]

const socialLinks = [
  { name: 'Twitter', href: 'https://twitter.com/syncentia', icon: Twitter },
  { name: 'GitHub', href: 'https://github.com/syncentia', icon: Github },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/syncentia', icon: Linkedin },
  { name: 'YouTube', href: 'https://youtube.com/@syncentia', icon: Youtube },
]

export function Footer() {
  return (
    <footer className="bg-card/50 border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-xl font-bold text-primary-foreground">S</span>
              </div>
              <span className="text-xl font-bold gradient-text">Syncentia</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              Your trusted source for tech reviews, comparisons, and recommendations.
              Helping you make smarter tech decisions.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-secondary hover:bg-primary/20 flex items-center justify-center transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5 text-muted-foreground hover:text-primary" />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Categories</h3>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <category.icon className="w-4 h-4" />
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Legal</h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12">
          <AdSlot placement="footer" />
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Syncentia. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with passion for tech enthusiasts worldwide.
          </p>
        </div>
      </div>
    </footer>
  )
}
