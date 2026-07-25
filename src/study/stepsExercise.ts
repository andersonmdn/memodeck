import type { StepsCard } from '@/models/Card'

export type StepsExerciseType = 'sort' | 'next-step' | 'missing-step'

export interface SortExercise {
  type: 'sort'
  card: StepsCard
  scrambled: string[]
}

export interface NextStepExercise {
  type: 'next-step'
  card: StepsCard
  shownSteps: string[]
  options: string[]
  correctAnswer: string
}

export interface MissingStepExercise {
  type: 'missing-step'
  card: StepsCard
  visibleSteps: string[]
  hiddenIndex: number
  options: string[]
  correctAnswer: string
}

export type StepsExercise = SortExercise | NextStepExercise | MissingStepExercise

const EXERCISE_CYCLE: StepsExerciseType[] = ['sort', 'next-step', 'missing-step']

export function getExerciseType(reviewCount: number, stepsCount: number): StepsExerciseType {
  if (stepsCount < 3) return 'sort'
  return EXERCISE_CYCLE[reviewCount % 3]
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildOptions(correct: string, pool: string[]): string[] {
  const distractors = shuffle(pool.filter((s) => s !== correct)).slice(0, 3)
  return shuffle([correct, ...distractors])
}

export function buildSortExercise(card: StepsCard): SortExercise {
  let scrambled = shuffle(card.steps)
  // Ensure the scrambled order is never identical to the original
  while (card.steps.length > 1 && scrambled.every((s, i) => s === card.steps[i])) {
    scrambled = shuffle(card.steps)
  }
  return { type: 'sort', card, scrambled }
}

export function buildNextStepExercise(card: StepsCard): NextStepExercise {
  // Show between 1 and (steps.length - 1) steps, ask for the next one
  const n = 1 + Math.floor(Math.random() * (card.steps.length - 1))
  const shownSteps = card.steps.slice(0, n)
  const correctAnswer = card.steps[n]
  const pool = card.steps.filter((_, i) => i !== n)
  return {
    type: 'next-step',
    card,
    shownSteps,
    options: buildOptions(correctAnswer, pool),
    correctAnswer,
  }
}

export function buildMissingStepExercise(card: StepsCard): MissingStepExercise {
  const hiddenIndex = Math.floor(Math.random() * card.steps.length)
  const correctAnswer = card.steps[hiddenIndex]
  const visibleSteps = card.steps.map((s, i) => (i === hiddenIndex ? '___' : s))
  const pool = card.steps.filter((_, i) => i !== hiddenIndex)
  return {
    type: 'missing-step',
    card,
    visibleSteps,
    hiddenIndex,
    options: buildOptions(correctAnswer, pool),
    correctAnswer,
  }
}

export function buildStepsExercise(card: StepsCard): StepsExercise {
  const exerciseType = getExerciseType(card.reviewCount, card.steps.length)
  switch (exerciseType) {
    case 'sort':
      return buildSortExercise(card)
    case 'next-step':
      return buildNextStepExercise(card)
    case 'missing-step':
      return buildMissingStepExercise(card)
  }
}
