export interface StudySession {
  id: string
  deckId: string
  startedAt: Date
  endedAt?: Date
  cardsStudied: number
  correctCount: number
}
