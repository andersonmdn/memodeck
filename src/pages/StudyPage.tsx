import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Maximize2, Minimize2, CheckCircle2, RotateCcw, Flame } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { ClozeText } from '@/components/study/ClozeText'
import { RatingButtons } from '@/components/study/RatingButtons'
import { useStudySession } from '@/hooks/useStudySession'
import { useKeyboard } from '@/hooks/useKeyboard'
import { getDeckById } from '@/storage/deckStore'
import { cn } from '@/utils/cn'
import { useGlobalStats } from '@/hooks/useStats'
import type { Deck } from '@/models/Deck'
import type { Rating } from '@/models/Card'
import { calculateRetention } from '@/study/session'

const CONFETTI = Array.from({ length: 10 }, (_, i) => ({
  angle: (i / 10) * 360,
  color: ['#7c3aed', '#22c55e', '#f59e0b', '#ec4899', '#3b82f6'][i % 5],
  distance: 60 + (i % 3) * 20,
}))

function ConfettiBurst() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      {CONFETTI.map((p, i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full"
          style={{ backgroundColor: p.color }}
          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
          animate={{
            x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
            y: Math.sin((p.angle * Math.PI) / 180) * p.distance,
            scale: [0, 1.5, 0],
            opacity: [1, 1, 0],
          }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
        />
      ))}
    </div>
  )
}

export function StudyPage() {
  const { deckId } = useParams<{ deckId: string }>()
  const navigate = useNavigate()
  const isAllDecks = deckId === 'all'
  const [deck, setDeck] = useState<Deck | null>(null)
  const [fullscreen, setFullscreen] = useState(false)
  const [exitDialogOpen, setExitDialogOpen] = useState(false)
  const { streak } = useGlobalStats()
  const {
    currentCard,
    currentIndex,
    totalCards,
    revealed,
    done,
    ratings,
    start,
    showAnswer,
    rate,
  } = useStudySession(deckId ?? '')

  useEffect(() => {
    if (!deckId || isAllDecks) return
    getDeckById(deckId).then((d) => {
      if (d) setDeck(d)
      else navigate('/library')
    })
  }, [deckId, isAllDecks, navigate])

  const deckTitle = isAllDecks ? 'Todas as revisões' : deck?.title ?? ''

  useEffect(() => {
    start()
  }, [start])

  const handleRate = async (rating: Rating) => {
    await rate(rating)
  }

  const handleExit = () => {
    if (!done && totalCards > 0 && ratings.length > 0) {
      setExitDialogOpen(true)
    } else {
      navigate(-1)
    }
  }

  useKeyboard({
    ' ': () => { if (!revealed && !done) showAnswer() },
    '1': () => { if (revealed) handleRate(1) },
    '2': () => { if (revealed) handleRate(2) },
    '3': () => { if (revealed) handleRate(3) },
    '4': () => { if (revealed) handleRate(4) },
    Escape: handleExit,
    f: () => setFullscreen((v) => !v),
    F: () => setFullscreen((v) => !v),
  })

  if (!isAllDecks && !deck) return null

  if (totalCards === 0) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-[var(--color-background)] p-8">
        <CheckCircle2 className="h-12 w-12 text-[var(--color-success)]" />
        <h2 className="text-xl font-semibold text-[var(--color-text)]">Tudo em dia!</h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          {isAllDecks
            ? 'Nenhum cartão para revisar agora.'
            : `Nenhum cartão para revisar agora em "${deckTitle}".`}
        </p>
        <Button onClick={() => navigate(-1)}>Voltar à biblioteca</Button>
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
        className="relative flex h-screen flex-col items-center justify-center gap-6 bg-[var(--color-background)] p-8"
      >
        <ConfettiBurst />
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-success)]/20">
          <CheckCircle2 className="h-8 w-8 text-[var(--color-success)]" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[var(--color-text)]">Sessão concluída!</h2>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">{deckTitle}</p>
        </div>
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-[var(--color-text)]">{ratings.length}</p>
            <p className="text-xs text-[var(--color-text-subtle)] mt-1">Revisados</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[var(--color-success)]">{good}</p>
            <p className="text-xs text-[var(--color-text-subtle)] mt-1">Corretos</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[var(--color-accent)]">{retention}%</p>
            <p className="text-xs text-[var(--color-text-subtle)] mt-1">Retenção</p>
          </div>
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-1.5 text-orange-400">
            <Flame className="h-4 w-4" />
            <span className="text-sm font-semibold">{streak}d de sequência</span>
          </div>
        )}
        <div className="flex gap-3">
          <Button variant="secondary" onClick={start}>
            <RotateCcw className="h-4 w-4" /> Repetir
          </Button>
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ delay: 1.2, duration: 0.5, ease: 'easeInOut' }}
          >
            <Button onClick={() => navigate(-1)}>Voltar à biblioteca</Button>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  return (
    <>
      <div className={cn('flex h-screen flex-col bg-[var(--color-background)]', fullscreen && 'fixed inset-0 z-50')}>
        {/* Top bar */}
        <div className="flex items-center gap-4 border-b border-[var(--color-border-subtle)] px-6 py-3">
          <Button variant="ghost" size="icon" aria-label="Sair da sessão" onClick={handleExit}>
            <X className="h-4 w-4" />
          </Button>
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-sm font-semibold text-[var(--color-text)] truncate">{deckTitle}</p>
              <span className="text-xs tabular-nums text-[var(--color-text-subtle)] shrink-0">
                {currentIndex + 1}/{totalCards}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label={fullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
            onClick={() => setFullscreen((v) => !v)}
          >
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
                  className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-10 shadow-[0_1px_8px_rgba(0,0,0,0.35)]"
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
                <Button size="lg" className="w-full" onClick={showAnswer}>
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
            <p className="mt-4 text-center text-xs text-[var(--color-text-subtle)]">
              {revealed ? '1–4 para avaliar • Esc para sair' : 'Espaço para revelar • Esc para sair'}
            </p>
          </div>
        </div>
      </div>

      <AlertDialog open={exitDialogOpen} onOpenChange={setExitDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sair da sessão?</AlertDialogTitle>
            <AlertDialogDescription>
              As revisões feitas até agora serão salvas. Você pode continuar o deck depois.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuar revisando</AlertDialogCancel>
            <AlertDialogAction className={buttonVariants({ variant: 'destructive' })} onClick={() => navigate(-1)}>Sair</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
