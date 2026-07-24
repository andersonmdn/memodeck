import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/storage/db'
import type { ReviewRecord } from '@/models/ReviewRecord'
import type { Card } from '@/models/Card'
import { getDayStreak, isSameDay, startOfDay } from '@/utils/dateUtils'

export function useGlobalStats() {
  const reviews: ReviewRecord[] = useLiveQuery(() => db.reviews.orderBy('reviewedAt').toArray(), []) ?? []
  const cards: Card[] = useLiveQuery(() => db.cards.toArray(), []) ?? []

  const today = new Date()
  const reviewedToday = reviews.filter((r) => isSameDay(r.reviewedAt, today)).length
  const dueToday = cards.filter((c) => c.dueDate <= today).length
  const streak = getDayStreak(reviews.map((r) => r.reviewedAt))
  const totalReviewed = reviews.length
  const retention =
    reviews.length > 0
      ? Math.round((reviews.filter((r) => r.rating >= 3).length / reviews.length) * 100)
      : 0

  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (29 - i))
    const day = startOfDay(d)
    const count = reviews.filter((r) => isSameDay(r.reviewedAt, day)).length
    return {
      date: day.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      count,
    }
  })

  return { reviewedToday, dueToday, streak, totalReviewed, retention, last30Days }
}

export function useDeckStats(deckId: string) {
  const cards: Card[] = useLiveQuery(() => db.cards.where('deckId').equals(deckId).toArray(), [deckId]) ?? []
  const reviews: ReviewRecord[] = useLiveQuery(() => db.reviews.where('deckId').equals(deckId).toArray(), [deckId]) ?? []

  const total = cards.length
  const reviewed = cards.filter((c) => c.state !== 'new').length
  const progress = total > 0 ? Math.round((reviewed / total) * 100) : 0
  const retention =
    reviews.length > 0
      ? Math.round((reviews.filter((r) => r.rating >= 3).length / reviews.length) * 100)
      : 0

  return { total, reviewed, progress, retention }
}
