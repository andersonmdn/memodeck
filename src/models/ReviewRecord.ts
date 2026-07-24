import type { Rating } from './Card'

export interface ReviewRecord {
  id: string
  cardId: string
  deckId: string
  rating: Rating
  reviewedAt: Date
  timeTaken: number
}
