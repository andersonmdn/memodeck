import { useMemo } from 'react'
import { renderClozeMarkdown } from '@/parser/markdownRenderer'

interface ClozeTextProps {
  rawText: string
  clozeIndex: number
  revealed: boolean
}

export function ClozeText({ rawText, clozeIndex, revealed }: ClozeTextProps) {
  const html = useMemo(
    () => renderClozeMarkdown(rawText, clozeIndex, revealed),
    [rawText, clozeIndex, revealed],
  )

  return (
    <div
      className="prose text-lg leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
