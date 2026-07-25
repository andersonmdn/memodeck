export type CardType = 'cloze' | 'steps'
export type CardState = 'new' | 'learning' | 'review'
export type Rating = 1 | 2 | 3 | 4

interface CardBase {
  id: string
  deckId: string
  type: CardType
  state: CardState
  dueDate: Date
  interval: number
  easeFactor: number
  reviewCount: number
}

export interface ClozeCard extends CardBase {
  type: 'cloze'
  clozeIndex: number
  rawText: string
  answer: string
}

export interface StepsCard extends CardBase {
  type: 'steps'
  title: string
  steps: string[]
}

export type Card = ClozeCard | StepsCard

export function isClozeCard(card: Card): card is ClozeCard {
  return card.type === 'cloze'
}

export function isStepsCard(card: Card): card is StepsCard {
  return card.type === 'steps'
}
