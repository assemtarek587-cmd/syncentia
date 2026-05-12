'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'

type SearchResultType = 'post' | 'affiliate_link' | 'category'

type SearchResult = {
  type: SearchResultType
  title: string
  url: string
  subtitle: string
  description?: string | null
}

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  const postResults = useMemo(
    () => results.filter((result) => result.type === 'post'),
    [results],
  )
  const affiliateResults = useMemo(
    () => results.filter((result) => result.type === 'affiliate_link'),
    [results],
  )
  const categoryResults = useMemo(
    () => results.filter((result) => result.type === 'category'),
    [results],
  )

  useEffect(() => {
    if (!open) return

    const trimmed = query.trim()
    if (trimmed.length < 2) {
      setResults([])
      setLoading(false)
      return
    }

    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setLoading(true)

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          setResults([])
          setLoading(false)
          return
        }

        const data = await response.json()
        setResults(data.results || [])
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 220)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [open, query])

  const handleOpenChange = (value: boolean) => {
    onOpenChange(value)

    if (!value) {
      setQuery('')
      setResults([])
      setLoading(false)
    }
  }

  const handleResultSelect = (url: string) => {
    handleOpenChange(false)
    router.push(url)
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Search Syncentia"
      description="Search posts, categories, and affiliate links"
      className="max-w-xl"
    >
      <CommandInput
        autoFocus
        placeholder="Search posts, categories, links..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>
          {loading
            ? 'Searching…'
            : query.trim().length < 2
            ? 'Type 2 or more characters to search.'
            : 'No results found.'}
        </CommandEmpty>

        {postResults.length > 0 && (
          <CommandGroup heading="Blog posts">
            {postResults.map((result) => (
              <CommandItem
                key={`post-${result.url}`}
                value={result.url}
                onSelect={() => handleResultSelect(result.url)}
              >
                <div className="flex flex-col gap-0.5">
                  <span>{result.title}</span>
                  <span className="text-xs text-muted-foreground">{result.subtitle}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {affiliateResults.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Affiliate links">
              {affiliateResults.map((result) => (
                <CommandItem
                  key={`affiliate-${result.url}`}
                  value={result.url}
                  onSelect={() => handleResultSelect(result.url)}
                >
                  <div className="flex flex-col gap-0.5">
                    <span>{result.title}</span>
                    <span className="text-xs text-muted-foreground">{result.subtitle}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {categoryResults.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Categories">
              {categoryResults.map((result) => (
                <CommandItem
                  key={`category-${result.url}`}
                  value={result.url}
                  onSelect={() => handleResultSelect(result.url)}
                >
                  <div className="flex flex-col gap-0.5">
                    <span>{result.title}</span>
                    <span className="text-xs text-muted-foreground">{result.subtitle}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}
