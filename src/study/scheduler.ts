import type { Card, CardState, Rating } from '@/models/Card'

const MIN_EASE = 1.3
const DEFAULT_EASE = 2.5

function addDays(days: number): Date {
  const d = new Date()
  d.setDate(d.getDate() + days)
  d.setHours(0, 0, 0, 0)
  return d
}

export function scheduleNext(card: Card, rating: Rating): Partial<Card> {
  let { interval, easeFactor } = card

  if (rating === 1) {
    return {
      interval: 1,
      easeFactor: Math.max(MIN_EASE, easeFactor - 0.2),
      state: 'learning' as CardState,
      dueDate: addDays(1),
    }
  }

  if (rating === 2) {
    interval = Math.max(1, Math.round(interval * 1.2))
    easeFactor = Math.max(MIN_EASE, easeFactor - 0.15)
  } else if (rating === 3) {
    interval = Math.max(1, Math.round(interval * easeFactor))
  } else if (rating === 4) {
    interval = Math.max(1, Math.round(interval * easeFactor * 1.3))
    easeFactor = Math.min(easeFactor + 0.15, 5.0)
  }

  const state: CardState = interval >= 7 ? 'review' : 'learning'
  return { interval, easeFactor, state, dueDate: addDays(interval) }
}

export function createNewCard(overrides: Partial<Card> = {}): Pick<Card, 'state' | 'dueDate' | 'interval' | 'easeFactor'> {
  return {
    state: 'new',
    dueDate: new Date(),
    interval: 1,
    easeFactor: DEFAULT_EASE,
    ...overrides,
  }
}
