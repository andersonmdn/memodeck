import { useMemo, useState, useCallback } from 'react'
import { Reorder, AnimatePresence, motion } from 'framer-motion'
import { GripVertical, CheckCircle2, XCircle, ListOrdered, ChevronRight, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import type { StepsCard } from '@/models/Card'
import {
  buildStepsExercise,
  type StepsExercise,
  type SortExercise,
  type NextStepExercise,
  type MissingStepExercise,
} from '@/study/stepsExercise'

interface StepsExerciseCardProps {
  card: StepsCard
  onComplete: (correct: boolean) => void
}

// ── Sort Exercise ────────────────────────────────────────────────────────────

interface SortProps {
  exercise: SortExercise
  onResult: (correct: boolean) => void
}

function SortExerciseView({ exercise, onResult }: SortProps) {
  const [items, setItems] = useState(exercise.scrambled)
  const [submitted, setSubmitted] = useState(false)
  const [correct, setCorrect] = useState(false)

  const handleSubmit = useCallback(() => {
    const isCorrect = items.every((s, i) => s === exercise.card.steps[i])
    setCorrect(isCorrect)
    setSubmitted(true)
    setTimeout(() => onResult(isCorrect), 900)
  }, [items, exercise.card.steps, onResult])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
        <ListOrdered className="h-4 w-4 shrink-0" />
        <span>Arraste os passos na ordem correta</span>
      </div>

      <Reorder.Group
        axis="y"
        values={items}
        onReorder={setItems}
        className="space-y-2"
        style={{ listStyle: 'none', padding: 0, margin: 0 }}
      >
        {items.map((step, i) => (
          <Reorder.Item
            key={step}
            value={step}
            className={cn(
              'flex items-center gap-3 rounded-lg border p-3 text-sm cursor-grab active:cursor-grabbing select-none',
              submitted
                ? exercise.card.steps[i] === step
                  ? 'border-[var(--color-success)]/50 bg-[var(--color-success)]/8 text-[var(--color-text)]'
                  : 'border-[var(--color-danger)]/50 bg-[var(--color-danger)]/8 text-[var(--color-text)]'
                : 'border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-text)] hover:border-[var(--color-border-strong)]',
            )}
            whileDrag={{ scale: 1.02, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}
          >
            <GripVertical className="h-4 w-4 shrink-0 text-[var(--color-text-subtle)]" />
            <span className="flex-1">{step}</span>
            {submitted && (
              exercise.card.steps[i] === step
                ? <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--color-success)]" />
                : <XCircle className="h-4 w-4 shrink-0 text-[var(--color-danger)]" />
            )}
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {!submitted && (
        <Button className="w-full" onClick={handleSubmit}>
          Confirmar ordem
        </Button>
      )}

      <AnimatePresence>
        {submitted && (
          <FeedbackBanner correct={correct} />
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Choice Exercise (Next Step + Missing Step) ───────────────────────────────

interface ChoiceProps {
  context: string[]
  contextLabel: string
  options: string[]
  correctAnswer: string
  onResult: (correct: boolean) => void
}

function ChoiceExerciseView({ context, contextLabel, options, correctAnswer, onResult }: ChoiceProps) {
  const [selected, setSelected] = useState<string | null>(null)

  const handleSelect = useCallback((option: string) => {
    if (selected) return
    setSelected(option)
    const isCorrect = option === correctAnswer
    setTimeout(() => onResult(isCorrect), 900)
  }, [selected, correctAnswer, onResult])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
        <Eye className="h-4 w-4 shrink-0" />
        <span>{contextLabel}</span>
      </div>

      {/* Context list */}
      <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] divide-y divide-[var(--color-border-subtle)]">
        {context.map((step, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-text)]">
            {step === '___' ? (
              <>
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/20 text-[10px] font-bold text-[var(--color-accent)]">
                  {i + 1}
                </span>
                <span className="font-semibold text-[var(--color-accent)] tracking-widest">• • •</span>
              </>
            ) : (
              <>
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-3)] text-[10px] font-medium text-[var(--color-text-muted)]">
                  {i + 1}
                </span>
                <span>{step}</span>
              </>
            )}
          </div>
        ))}
        {/* Arrow indicating "what's next?" for next-step mode */}
        {!context.includes('___') && (
          <div className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-accent)]">
            <ChevronRight className="h-4 w-4 shrink-0" />
            <span className="italic">Qual é o próximo passo?</span>
          </div>
        )}
      </div>

      {/* Options */}
      <div className="grid gap-2">
        {options.map((option) => {
          const isSelected = selected === option
          const isCorrect = option === correctAnswer
          const showResult = selected !== null

          return (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              disabled={selected !== null}
              className={cn(
                'w-full rounded-lg border px-4 py-3 text-left text-sm transition-all duration-200',
                !showResult
                  ? 'border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-text)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-3)] disabled:cursor-not-allowed'
                  : isCorrect
                    ? 'border-[var(--color-success)]/60 bg-[var(--color-success)]/10 text-[var(--color-text)]'
                    : isSelected
                      ? 'border-[var(--color-danger)]/60 bg-[var(--color-danger)]/10 text-[var(--color-text)]'
                      : 'border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-text-muted)] opacity-60',
              )}
            >
              <span className="flex items-center justify-between gap-2">
                <span>{option}</span>
                {showResult && isCorrect && <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--color-success)]" />}
                {showResult && isSelected && !isCorrect && <XCircle className="h-4 w-4 shrink-0 text-[var(--color-danger)]" />}
              </span>
            </button>
          )
        })}
      </div>

      <AnimatePresence>
        {selected && (
          <FeedbackBanner correct={selected === correctAnswer} />
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Feedback Banner ──────────────────────────────────────────────────────────

function FeedbackBanner({ correct }: { correct: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className={cn(
        'flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium',
        correct
          ? 'bg-[var(--color-success)]/15 text-[var(--color-success)]'
          : 'bg-[var(--color-danger)]/15 text-[var(--color-danger)]',
      )}
    >
      {correct ? (
        <><CheckCircle2 className="h-4 w-4 shrink-0" /> Correto!</>
      ) : (
        <><XCircle className="h-4 w-4 shrink-0" /> Incorreto</>
      )}
    </motion.div>
  )
}

// ── Orchestrator ─────────────────────────────────────────────────────────────

const EXERCISE_LABELS: Record<StepsExercise['type'], string> = {
  sort: 'Ordenar sequência',
  'next-step': 'Próximo passo',
  'missing-step': 'Passo faltando',
}

export function StepsExerciseCard({ card, onComplete }: StepsExerciseCardProps) {
  const exercise = useMemo(() => buildStepsExercise(card), [card.id])

  const renderExercise = () => {
    switch (exercise.type) {
      case 'sort':
        return <SortExerciseView exercise={exercise as SortExercise} onResult={onComplete} />
      case 'next-step': {
        const ex = exercise as NextStepExercise
        return (
          <ChoiceExerciseView
            context={ex.shownSteps}
            contextLabel="Qual é o próximo passo desta sequência?"
            options={ex.options}
            correctAnswer={ex.correctAnswer}
            onResult={onComplete}
          />
        )
      }
      case 'missing-step': {
        const ex = exercise as MissingStepExercise
        return (
          <ChoiceExerciseView
            context={ex.visibleSteps}
            contextLabel="Qual passo está faltando?"
            options={ex.options}
            correctAnswer={ex.correctAnswer}
            onResult={onComplete}
          />
        )
      }
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400">
            Steps · {EXERCISE_LABELS[exercise.type]}
          </span>
        </div>
        <h2 className="text-lg font-semibold text-[var(--color-text)]">{card.title}</h2>
      </div>

      {renderExercise()}
    </div>
  )
}
