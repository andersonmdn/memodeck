import Dexie, { type Table } from 'dexie'
import type { Deck } from '@/models/Deck'
import type { Card } from '@/models/Card'
import type { ReviewRecord } from '@/models/ReviewRecord'
import type { StudySession } from '@/models/StudySession'

class MemoDeckDB extends Dexie {
  decks!: Table<Deck>
  cards!: Table<Card>
  reviews!: Table<ReviewRecord>
  sessions!: Table<StudySession>

  constructor() {
    super('MemoDeckDB')

    this.version(1).stores({
      decks: '&id, title, isFavorite, importedAt, lastStudied',
      cards: '&id, deckId, state, dueDate, clozeIndex',
      reviews: '&id, cardId, deckId, reviewedAt',
      sessions: '&id, deckId, startedAt',
    })

    this.version(2)
      .stores({
        decks: '&id, title, isFavorite, importedAt, lastStudied',
        cards: '&id, deckId, type, state, dueDate',
        reviews: '&id, cardId, deckId, reviewedAt',
        sessions: '&id, deckId, startedAt',
      })
      .upgrade(tx => {
        return Promise.all([
          tx.table('cards').toCollection().modify((card: Record<string, unknown>) => {
            card['type'] = 'cloze'
            card['reviewCount'] = 0
          }),
          tx.table('decks').toCollection().modify((deck: Record<string, unknown>) => {
            deck['contentTypes'] = ['cloze']
          }),
        ])
      })
  }
}

export const db = new MemoDeckDB()
