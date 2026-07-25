import { db } from './db'
import type { Card, Rating } from '@/models/Card'
import type { ReviewRecord } from '@/models/ReviewRecord'
import type { StudySession } from '@/models/StudySession'
import { scheduleNext } from '@/study/scheduler'

export async function getDueCards(deckId: string): Promise<Card[]> {
  const now = new Date()
  return db.cards
    .where('deckId')
    .equals(deckId)
    .filter((c) => c.dueDate <= now)
    .toArray()
}

export async function getAllDueCards(): Promise<Card[]> {
  const now = new Date()
  return db.cards.filter((c) => c.dueDate <= now).toArray()
}

export async function recordReview(
  card: Card,
  rating: Rating,
  timeTaken: number,
): Promise<void> {
  const review: ReviewRecord = {
    id: crypto.randomUUID(),
    cardId: card.id,
    deckId: card.deckId,
    rating,
    reviewedAt: new Date(),
    timeTaken,
  }
  const updatedCard = {
    ...scheduleNext(card, rating),
    reviewCount: (card.reviewCount ?? 0) + 1,
  }

  await db.transaction('rw', db.cards, db.reviews, db.decks, async () => {
    await db.cards.update(card.id, updatedCard)
    await db.reviews.add(review)
    await db.decks.update(card.deckId, { lastStudied: new Date() })
  })
}

export async function getReviewsByDeck(deckId: string): Promise<ReviewRecord[]> {
  return db.reviews.where('deckId').equals(deckId).toArray()
}

export async function getAllReviews(): Promise<ReviewRecord[]> {
  return db.reviews.orderBy('reviewedAt').toArray()
}

export async function saveSession(session: StudySession): Promise<void> {
  await db.sessions.put(session)
}

export async function getCardCount(deckId: string): Promise<number> {
  return db.cards.where('deckId').equals(deckId).count()
}
