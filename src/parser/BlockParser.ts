import type { Card } from '@/models/Card'

export interface BlockParser {
  matches(block: string): boolean
  parse(block: string, deckId: string): Card[]
}
