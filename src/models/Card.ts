export type CardState = 'new' | 'learning' | 'review'
export type Rating = 1 | 2 | 3 | 4

export interface Card {
  id: string
  deckId: string
  clozeIndex: number
  rawText: string
  answer: string
  state: CardState
  dueDate: Date
  interval: number
  easeFactor: number
}
