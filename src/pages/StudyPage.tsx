import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Maximize2, Minimize2, CheckCircle2, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ClozeText } from '@/components/study/ClozeText'
import { RatingButtons } from '@/components/study/RatingButtons'
import { StudyProgress } from '@/components/study/StudyProgress'
import { useStudySession } from '@/hooks/useStudySession'
import { useKeyboard } from '@/hooks/useKeyboard'
import { getDeckById } from '@/storage/deckStore'
import type { Deck } from '@/models/Deck'
import type { Rating } from '@/models/Card'
import { calculateRetention } from '@/study/session'

export function StudyPage() {
  const { deckId } = useParams<{ deckId: string }>()
  const navigate = useNavigate()
  const [deck, setDeck] = useState<Deck | null>(null)
  const [fullscreen, setFullscreen] = useState(false)
  const {
    queue,
    currentCard,
    currentIndex,
    totalCards,
    revealed,
    done,
    ratings,
    progress,
    start,
    showAnswer,
    rate,
  } = useStudySession(deckId ?? '')

  useEffect(() => {
    if (!deckId) return
    getDeckById(deckId).then((d) => {
      if (d) setDeck(d)
      else navigate('/library')
    })
  }, [deckId, navigate])

  useEffect(() => {
    start()
  }, [start])

  const handleRate = async (rating: Rating) => {
    await rate(rating)
  }

  useKeyboard({
    ' ': () => { if (!revealed && !done) showAnswer() },
    '1': () => { if (revealed) handleRate(1) },
    '2': () => { if (revealed) handleRate(2) },
    '3': () => { if (revealed) handleRate(3) },
    '4': () => { if (revealed) handleRate(4) },
    Escape: () => navigate('/library'),
    f: () => setFullscreen((v) => !v),
    F: () => setFullscreen((v) => !v),
  })

  if (!deck) return null

  if (totalCards === 0) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-[--color-background] p-8">
        <CheckCircle2 className="h-12 w-12 text-[--color-success]" />
        <h2 className="text-xl font-semibold text-[--color-text]">Tudo em dia!</h2>
        <p className="text-sm text-[--color-text-muted]">
          Nenhum cartão para revisar agora em "{deck.title}".
        </p>
        <Button onClick={() => navigate('/library')}>Voltar à biblioteca</Button>
      </div>
    )
  }

  if (done) {
    const retention = calculateRetention(ratings)
    const good = ratings.filter((r) => r >= 3).length
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex h-screen flex-col items-center justify-center gap-6 bg-[--color-background] p-8"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[--color-success]/20">
          <CheckCircle2 className="h-8 w-8 text-[--color-success]" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[--color-text]">Sessão concluída!</h2>
          <p className="mt-1 text-sm text-[--color-text-muted]">{deck.title}</p>
        </div>
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-[--color-text]">{ratings.length}</p>
            <p className="text-xs text-[--color-text-subtle] mt-1">Revisados</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[--color-success]">{good}</p>
            <p className="text-xs text-[--color-text-subtle] mt-1">Corretos</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[--color-accent]">{retention}%</p>
            <p className="text-xs text-[--color-text-subtle] mt-1">Retenção</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={start}>
            <RotateCcw className="h-4 w-4" /> Repetir
          </Button>
          <Button onClick={() => navigate('/library')}>Voltar à biblioteca</Button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className={`flex h-screen flex-col bg-[--color-background] ${fullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Top bar */}
      <div className="flex items-center gap-4 border-b border-[--color-border-subtle] px-6 py-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/library')}>
          <X className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <p className="text-sm font-medium text-[--color-text] truncate">{deck.title}</p>
          <StudyProgress current={currentIndex} total={totalCards} />
        </div>
        <Button variant="ghost" size="icon" onClick={() => setFullscreen((v) => !v)}>
          {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>

      {/* Card */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {currentCard && (
              <motion.div
                key={currentCard.id + revealed}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="rounded-xl border border-[--color-border-subtle] bg-[--color-surface] p-8"
              >
                <ClozeText
                  rawText={currentCard.rawText}
                  clozeIndex={currentCard.clozeIndex}
                  revealed={revealed}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="mt-6">
            {!revealed ? (
              <Button
                className="w-full h-11"
                onClick={showAnswer}
              >
                Mostrar resposta
                <kbd className="ml-2 rounded border border-white/20 bg-white/10 px-1.5 py-0.5 text-xs">
                  Espaço
                </kbd>
              </Button>
            ) : (
              <RatingButtons onRate={handleRate} />
            )}
          </div>

          {/* Keyboard hint */}
          <p className="mt-4 text-center text-xs text-[--color-text-subtle]">
            {revealed
              ? 'Teclas 1–4 para avaliar • Esc para sair'
              : 'Espaço para revelar • Esc para sair'}
          </p>
        </div>
      </div>
    </div>
  )
}
