import { useState, useCallback, useRef } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { getCardsByDeckId } from '@/storage/deckStore'
import { recordReview, getDueCards } from '@/storage/progressStore'
import { buildStudyQueue } from '@/study/session'
import type { Card, Rating } from '@/models/Card'

export function useStudySession(deckId: string, batchSize = 20) {
  const allCards: Card[] = useLiveQuery(() => getCardsByDeckId(deckId), [deckId]) ?? []
  const [queue, setQueue] = useState<Card[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [done, setDone] = useState(false)
  const [ratings, setRatings] = useState<Rating[]>([])
  const startTime = useRef<number>(Date.now())
  const cardStartTime = useRef<number>(Date.now())

  const start = useCallback(async () => {
    const due = await getDueCards(deckId)
    const q = buildStudyQueue([...due, ...allCards.filter((c) => c.state === 'new')], batchSize)
    setQueue(q)
    setCurrentIndex(0)
    setRevealed(false)
    setDone(false)
    setRatings([])
    startTime.current = Date.now()
    cardStartTime.current = Date.now()
  }, [deckId, allCards, batchSize])

  const showAnswer = useCallback(() => {
    setRevealed(true)
  }, [])

  const rate = useCallback(
    async (rating: Rating) => {
      const card = queue[currentIndex]
      if (!card) return
      const timeTaken = Date.now() - cardStartTime.current
      await recordReview(card, rating, timeTaken)
      setRatings((prev) => [...prev, rating])

      const next = currentIndex + 1
      if (next >= queue.length) {
        setDone(true)
      } else {
        setCurrentIndex(next)
        setRevealed(false)
        cardStartTime.current = Date.now()
      }
    },
    [queue, currentIndex],
  )

  const currentCard = queue[currentIndex] ?? null
  const progress = queue.length > 0 ? ((currentIndex) / queue.length) * 100 : 0

  return {
    queue,
    currentCard,
    currentIndex,
    totalCards: queue.length,
    revealed,
    done,
    ratings,
    progress,
    start,
    showAnswer,
    rate,
  }
}
