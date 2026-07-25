import { describe, it, expect } from 'vitest'
import {
  getExerciseType,
  buildSortExercise,
  buildNextStepExercise,
  buildMissingStepExercise,
  buildStepsExercise,
} from '../stepsExercise'
import type { StepsCard } from '@/models/Card'

function makeCard(steps: string[], reviewCount = 0): StepsCard {
  return {
    id: 'test-id',
    deckId: 'deck-id',
    type: 'steps',
    title: 'Processo Teste',
    steps,
    reviewCount,
    state: 'new',
    dueDate: new Date(),
    interval: 1,
    easeFactor: 2.5,
  }
}

const STEPS_5 = ['Passo 1', 'Passo 2', 'Passo 3', 'Passo 4', 'Passo 5']
const STEPS_2 = ['Alpha', 'Beta']

// ── getExerciseType ──────────────────────────────────────────────────────────

describe('getExerciseType', () => {
  it('reviewCount 0 → sort', () => {
    expect(getExerciseType(0, 5)).toBe('sort')
  })

  it('reviewCount 1 → next-step', () => {
    expect(getExerciseType(1, 5)).toBe('next-step')
  })

  it('reviewCount 2 → missing-step', () => {
    expect(getExerciseType(2, 5)).toBe('missing-step')
  })

  it('reviewCount 3 → sort (ciclo reinicia)', () => {
    expect(getExerciseType(3, 5)).toBe('sort')
  })

  it('reviewCount 7 → next-step (7 % 3 = 1)', () => {
    expect(getExerciseType(7, 5)).toBe('next-step')
  })

  it('fallback para sort quando steps < 3, independente de reviewCount', () => {
    expect(getExerciseType(1, 2)).toBe('sort')
    expect(getExerciseType(2, 2)).toBe('sort')
  })
})

// ── buildSortExercise ────────────────────────────────────────────────────────

describe('buildSortExercise', () => {
  it('retorna exercício com type=sort', () => {
    const card = makeCard(STEPS_5)
    const ex = buildSortExercise(card)
    expect(ex.type).toBe('sort')
  })

  it('scrambled contém os mesmos items que steps', () => {
    const card = makeCard(STEPS_5)
    const ex = buildSortExercise(card)
    expect(ex.scrambled).toHaveLength(STEPS_5.length)
    expect([...ex.scrambled].sort()).toEqual([...STEPS_5].sort())
  })

  it('scrambled não é igual à ordem original (para steps ≥ 2)', () => {
    // Com 5 steps, probabilidade de ficar na mesma ordem é 1/120 ≈ 0,8%
    // Rodamos 10 vezes para tornar falso positivo estatisticamente impossível
    const card = makeCard(STEPS_5)
    const allSame = Array.from({ length: 10 }, () => buildSortExercise(card))
      .every((ex) => ex.scrambled.every((s, i) => s === STEPS_5[i]))
    expect(allSame).toBe(false)
  })

  it('referencia o card correto', () => {
    const card = makeCard(STEPS_5)
    expect(buildSortExercise(card).card).toBe(card)
  })
})

// ── buildNextStepExercise ────────────────────────────────────────────────────

describe('buildNextStepExercise', () => {
  it('retorna exercício com type=next-step', () => {
    const ex = buildNextStepExercise(makeCard(STEPS_5))
    expect(ex.type).toBe('next-step')
  })

  it('correctAnswer está contida em options', () => {
    const ex = buildNextStepExercise(makeCard(STEPS_5))
    expect(ex.options).toContain(ex.correctAnswer)
  })

  it('correctAnswer é um step real do card', () => {
    const ex = buildNextStepExercise(makeCard(STEPS_5))
    expect(STEPS_5).toContain(ex.correctAnswer)
  })

  it('shownSteps precede correctAnswer na sequência original', () => {
    const ex = buildNextStepExercise(makeCard(STEPS_5))
    const correctIndex = STEPS_5.indexOf(ex.correctAnswer)
    expect(ex.shownSteps).toHaveLength(correctIndex)
    ex.shownSteps.forEach((step, i) => {
      expect(step).toBe(STEPS_5[i])
    })
  })

  it('shownSteps não contém o correctAnswer', () => {
    const ex = buildNextStepExercise(makeCard(STEPS_5))
    expect(ex.shownSteps).not.toContain(ex.correctAnswer)
  })

  it('options têm no máximo 4 itens', () => {
    const ex = buildNextStepExercise(makeCard(STEPS_5))
    expect(ex.options.length).toBeLessThanOrEqual(4)
  })

  it('options não contêm duplicatas', () => {
    const ex = buildNextStepExercise(makeCard(STEPS_5))
    expect(new Set(ex.options).size).toBe(ex.options.length)
  })
})

// ── buildMissingStepExercise ─────────────────────────────────────────────────

describe('buildMissingStepExercise', () => {
  it('retorna exercício com type=missing-step', () => {
    const ex = buildMissingStepExercise(makeCard(STEPS_5))
    expect(ex.type).toBe('missing-step')
  })

  it('visibleSteps tem "___" na posição hiddenIndex', () => {
    const ex = buildMissingStepExercise(makeCard(STEPS_5))
    expect(ex.visibleSteps[ex.hiddenIndex]).toBe('___')
  })

  it('visibleSteps tem o mesmo tamanho que steps', () => {
    const ex = buildMissingStepExercise(makeCard(STEPS_5))
    expect(ex.visibleSteps).toHaveLength(STEPS_5.length)
  })

  it('todos os outros steps em visibleSteps são corretos', () => {
    const ex = buildMissingStepExercise(makeCard(STEPS_5))
    ex.visibleSteps.forEach((step, i) => {
      if (i !== ex.hiddenIndex) {
        expect(step).toBe(STEPS_5[i])
      }
    })
  })

  it('correctAnswer é o step oculto', () => {
    const ex = buildMissingStepExercise(makeCard(STEPS_5))
    expect(ex.correctAnswer).toBe(STEPS_5[ex.hiddenIndex])
  })

  it('correctAnswer está contida em options', () => {
    const ex = buildMissingStepExercise(makeCard(STEPS_5))
    expect(ex.options).toContain(ex.correctAnswer)
  })

  it('options não contêm duplicatas', () => {
    const ex = buildMissingStepExercise(makeCard(STEPS_5))
    expect(new Set(ex.options).size).toBe(ex.options.length)
  })
})

// ── buildStepsExercise ───────────────────────────────────────────────────────

describe('buildStepsExercise', () => {
  it('reviewCount=0 → gera SortExercise', () => {
    const ex = buildStepsExercise(makeCard(STEPS_5, 0))
    expect(ex.type).toBe('sort')
  })

  it('reviewCount=1 → gera NextStepExercise', () => {
    const ex = buildStepsExercise(makeCard(STEPS_5, 1))
    expect(ex.type).toBe('next-step')
  })

  it('reviewCount=2 → gera MissingStepExercise', () => {
    const ex = buildStepsExercise(makeCard(STEPS_5, 2))
    expect(ex.type).toBe('missing-step')
  })

  it('card com 2 steps sempre gera SortExercise', () => {
    const ex = buildStepsExercise(makeCard(STEPS_2, 1))
    expect(ex.type).toBe('sort')
  })
})
