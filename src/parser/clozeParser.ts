import type { Card } from '@/models/Card'
import { createNewCard } from '@/study/scheduler'

const CLOZE_REGEX = /\{\{c(\d+)::([^}]+)\}\}/g

export interface ClozeMatch {
  index: number
  answer: string
}

export function extractClozes(text: string): ClozeMatch[] {
  const matches: ClozeMatch[] = []
  const seen = new Set<number>()
  let m: RegExpExecArray | null

  CLOZE_REGEX.lastIndex = 0
  while ((m = CLOZE_REGEX.exec(text)) !== null) {
    const idx = parseInt(m[1], 10)
    if (!seen.has(idx)) {
      seen.add(idx)
      matches.push({ index: idx, answer: m[2].trim() })
    }
  }
  return matches.sort((a, b) => a.index - b.index)
}

export function buildCards(deckId: string, rawText: string): Card[] {
  const clozes = extractClozes(rawText)
  return clozes.map((cloze) => ({
    id: crypto.randomUUID(),
    deckId,
    clozeIndex: cloze.index,
    rawText,
    answer: cloze.answer,
    ...createNewCard(),
  }))
}

export function renderClozeText(
  rawText: string,
  activeClozeIndex: number,
  revealed: boolean,
): string {
  return rawText.replace(CLOZE_REGEX, (_match, idxStr, answer: string) => {
    const idx = parseInt(idxStr, 10)
    if (idx === activeClozeIndex) {
      if (revealed) {
        return `<span class="cloze-revealed">${answer}</span>`
      }
      return `<span class="cloze-blank" aria-label="resposta oculta">____</span>`
    }
    return answer
  })
}
