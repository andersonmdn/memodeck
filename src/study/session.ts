import type { Card } from '@/models/Card'

export function buildStudyQueue(cards: Card[], batchSize = 20): Card[] {
  const now = new Date()

  const due = cards
    .filter((c) => c.dueDate <= now)
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())

  const newCards = cards
    .filter((c) => c.state === 'new' && c.dueDate > now)
    .slice(0, Math.max(0, batchSize - due.length))

  return [...due, ...newCards].slice(0, batchSize)
}

export function calculateRetention(ratings: number[]): number {
  if (ratings.length === 0) return 0
  const good = ratings.filter((r) => r >= 3).length
  return Math.round((good / ratings.length) * 100)
}
