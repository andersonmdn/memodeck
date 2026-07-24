import { load as loadYaml } from 'js-yaml'
import type { Deck } from '@/models/Deck'
import type { Card } from '@/models/Card'
import { buildCards } from './clozeParser'

function parseFrontmatter(text: string): { data: Record<string, unknown>; content: string } {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { data: {}, content: text }
  const data = (loadYaml(match[1]) ?? {}) as Record<string, unknown>
  return { data, content: match[2] ?? '' }
}

export interface ParsedDeck {
  deck: Deck
  cards: Card[]
  warnings: string[]
}

const CLOZE_BLOCK_REGEX = /\{\{c\d+::[^}]+\}\}/

function splitIntoParagraphs(content: string): string[] {
  return content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
}

export async function parseDeckFile(file: File): Promise<ParsedDeck> {
  const text = await file.text()
  return parseDeckText(text)
}

export function parseDeckText(text: string): ParsedDeck {
  const warnings: string[] = []
  const { data, content } = parseFrontmatter(text)

  if (!data['title']) {
    warnings.push('Título não encontrado no frontmatter. Usando nome padrão.')
  }

  const deck: Deck = {
    id: crypto.randomUUID(),
    title: String(data['title'] ?? 'Deck sem título'),
    description: String(data['description'] ?? ''),
    tags: Array.isArray(data['tags']) ? data['tags'].map(String) : [],
    version: typeof data['version'] === 'number' ? data['version'] : 1,
    importedAt: new Date(),
    isFavorite: false,
  }

  const paragraphs = splitIntoParagraphs(content)
  const clozeBlocks = paragraphs.filter((p) => CLOZE_BLOCK_REGEX.test(p))

  if (clozeBlocks.length === 0) {
    warnings.push('Nenhum cloze encontrado ({{cN::texto}}). O deck será importado sem cartões.')
  }

  const cards: Card[] = clozeBlocks.flatMap((block) => buildCards(deck.id, block))

  return { deck, cards, warnings }
}
