function normaliseStudyText(value) {
  if (value === null || value === undefined) return ''

  return String(value)
    .replace(/\r\n?/g, '\n')
    .replace(/References(?=Coverage)/g, 'References\n')
    .replace(/Checklist(?=\[\s*x\s*\])/gi, 'Checklist\n')
    .replace(/\]\s*(?=[A-Z0-9])/g, ']\n')
    .replace(/\s+(?=[•*-]\s)/g, '\n')
    .replace(/\s+(?=\d+[.)]\s)/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function InlineText({ children }) {
  const parts = String(children).split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index} className="rounded bg-stone-200/70 px-1 dark:bg-stone-800">{part.slice(1, -1)}</code>
    }
    return <span key={index}>{part}</span>
  })
}

export default function StudyText({ value, className = '' }) {
  const lines = normaliseStudyText(value).split('\n')
  const blocks = []

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim()
    if (!line) return

    if (/^#{1,4}\s/.test(line)) {
      blocks.push(<h4 key={index} className="pt-2 text-sm font-extrabold text-stone-900 dark:text-stone-100"><InlineText>{line.replace(/^#{1,4}\s+/, '')}</InlineText></h4>)
    } else if (/^(?:[-*•])\s+/.test(line)) {
      blocks.push(<li key={index} className="ml-5 list-disc pl-1"><InlineText>{line.replace(/^(?:[-*•])\s+/, '')}</InlineText></li>)
    } else if (/^\d+[.)]\s+/.test(line)) {
      blocks.push(<li key={index} className="ml-5 list-decimal pl-1"><InlineText>{line.replace(/^\d+[.)]\s+/, '')}</InlineText></li>)
    } else if (/^\[[ xX]\]\s*/.test(line)) {
      blocks.push(<li key={index} className="ml-5 list-none"><span className="mr-1.5 text-teal-600 dark:text-teal-400">✓</span><InlineText>{line.replace(/^\[[ xX]\]\s*/, '')}</InlineText></li>)
    } else {
      blocks.push(<p key={index} className="leading-7"><InlineText>{line}</InlineText></p>)
    }
  })

  return <div className={`space-y-2 ${className}`}>{blocks}</div>
}
