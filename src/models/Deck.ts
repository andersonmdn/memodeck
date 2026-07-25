export type ContentType = 'cloze' | 'steps'

export interface Deck {
  id: string
  title: string
  description: string
  tags: string[]
  version: number
  importedAt: Date
  lastStudied?: Date
  isFavorite: boolean
  color?: string
  contentTypes: ContentType[]
}
