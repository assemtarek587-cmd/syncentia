function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="text-foreground">
          {part.slice(2, -2)}
        </strong>
      )
    }

    return <span key={index}>{part}</span>
  })
}

function renderBlock(block: string, index: number) {
  const trimmed = block.trim()

  if (!trimmed) return null

  if (trimmed.startsWith('### ')) {
    return (
      <h3 key={index} className="mt-8 text-xl font-semibold text-foreground">
        {renderInline(trimmed.replace(/^###\s+/, ''))}
      </h3>
    )
  }

  if (trimmed.startsWith('## ')) {
    return (
      <h2 key={index} className="mt-10 text-2xl font-bold gradient-text">
        {renderInline(trimmed.replace(/^##\s+/, ''))}
      </h2>
    )
  }

  const lines = trimmed.split('\n')
  const isList = lines.every((line) => /^(-|\d+\.)\s+/.test(line.trim()))

  if (isList) {
    return (
      <ul key={index} className="ml-5 list-disc space-y-2 text-muted-foreground">
        {lines.map((line, lineIndex) => (
          <li key={lineIndex}>{renderInline(line.trim().replace(/^(-|\d+\.)\s+/, ''))}</li>
        ))}
      </ul>
    )
  }

  return (
    <p key={index} className="text-muted-foreground leading-relaxed">
      {renderInline(trimmed)}
    </p>
  )
}

export function ProseContent({ content }: { content: string }) {
  return <div className="space-y-6">{content.split(/\n{2,}/).map(renderBlock)}</div>
}
