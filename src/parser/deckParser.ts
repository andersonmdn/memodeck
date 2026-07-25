import { load as loadYaml } from 'js-yaml'
import type { Deck, ContentType } from '@/models/Deck'
import type { Card } from '@/models/Card'
import { blockRegistry } from './registry'

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

function splitIntoParagraphs(content: string): string[] {
  return content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
}

// Splits content into blocks while treating fenced code blocks (```...```)
// as atomic units — they must not be split at internal blank lines.
const FENCED_BLOCK_REGEX = /```\w*\n[\s\S]*?```/g

function splitIntoBlocks(content: string): string[] {
  const blocks: string[] = []
  FENCED_BLOCK_REGEX.lastIndex = 0
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = FENCED_BLOCK_REGEX.exec(content)) !== null) {
    splitIntoParagraphs(content.slice(lastIndex, match.index)).forEach((p) => blocks.push(p))
    blocks.push(match[0].trim())
    lastIndex = match.index + match[0].length
  }

  splitIntoParagraphs(content.slice(lastIndex)).forEach((p) => blocks.push(p))

  return blocks.filter(Boolean)
}

export async function parseDeckFile(file: File): Promise<ParsedDeck> {
  const text = await file.text()
  return parseDeckText(text)
}

export function parseDeckText(text: string): ParsedDeck {
  const normalizedText = text.replace(/\r\n/g, '\n')
  const warnings: string[] = []
  const { data, content } = parseFrontmatter(normalizedText)

  if (!data['title']) {
    warnings.push('Título não encontrado no frontmatter. Usando nome padrão.')
  }

  const deckBase = {
    id: crypto.randomUUID(),
    title: String(data['title'] ?? 'Deck sem título'),
    description: String(data['description'] ?? ''),
    tags: Array.isArray(data['tags']) ? data['tags'].map(String) : [],
    version: typeof data['version'] === 'number' ? data['version'] : 1,
    importedAt: new Date(),
    isFavorite: false,
  }

  const paragraphs = splitIntoBlocks(content)

  const cards: Card[] = paragraphs.flatMap((block) => {
    const parser = blockRegistry.find((p) => p.matches(block))
    return parser ? parser.parse(block, deckBase.id) : []
  })

  if (cards.length === 0) {
    warnings.push(
      'Nenhum cartão encontrado. O deck será importado sem cartões. ' +
        'Certifique-se de incluir blocos cloze ({{c1::texto}}) ou steps (```steps\\n...).',
    )
  }

  const contentTypes = [...new Set(cards.map((c) => c.type))] as ContentType[]

  const deck: Deck = { ...deckBase, contentTypes }

  return { deck, cards, warnings }
}
