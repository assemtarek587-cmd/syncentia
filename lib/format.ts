export function formatDate(dateString: string | null, style: 'short' | 'long' = 'short') {
  if (!dateString) return ''

  return new Date(dateString).toLocaleDateString('en-US', {
    month: style === 'long' ? 'long' : 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
