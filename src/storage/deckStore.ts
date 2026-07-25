import { db } from './db'
import type { Deck } from '@/models/Deck'
import type { Card } from '@/models/Card'

export async function saveImportedDeck(deck: Deck, cards: Card[]): Promise<void> {
  await db.transaction('rw', db.decks, db.cards, async () => {
    await db.decks.put(deck)
    await db.cards.bulkPut(cards)
  })
}

export async function getAllDecks(): Promise<Deck[]> {
  return db.decks.orderBy('importedAt').reverse().toArray()
}

export async function getDeckById(id: string): Promise<Deck | undefined> {
  return db.decks.get(id)
}

export async function getCardsByDeckId(deckId: string): Promise<Card[]> {
  return db.cards.where('deckId').equals(deckId).toArray()
}

export async function updateDeck(id: string, changes: Partial<Deck>): Promise<void> {
  await db.decks.update(id, changes)
}

export async function deleteDeck(id: string): Promise<void> {
  await db.transaction('rw', db.decks, db.cards, db.reviews, async () => {
    await db.decks.delete(id)
    const cardIds = await db.cards.where('deckId').equals(id).primaryKeys()
    await db.cards.bulkDelete(cardIds as string[])
    await db.reviews.where('deckId').equals(id).delete()
  })
}

export async function duplicateDeck(id: string): Promise<Deck> {
  const deck = await getDeckById(id)
  const cards = await getCardsByDeckId(id)
  if (!deck) throw new Error('Deck não encontrado')

  const newId = crypto.randomUUID()
  const newDeck: Deck = {
    ...deck,
    id: newId,
    title: `${deck.title} (cópia)`,
    importedAt: new Date(),
    lastStudied: undefined,
    isFavorite: false,
  }
  const newCards: Card[] = cards.map((c) => ({
    ...c,
    id: crypto.randomUUID(),
    deckId: newId,
    state: 'new',
    dueDate: new Date(),
    interval: 1,
    easeFactor: 2.5,
    reviewCount: 0,
  }))

  await saveImportedDeck(newDeck, newCards)
  return newDeck
}
