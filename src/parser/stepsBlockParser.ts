import type { BlockParser } from './BlockParser'
import type { StepsCard } from '@/models/Card'
import { createNewCard } from '@/study/scheduler'

const STEPS_FENCE_REGEX = /^```steps\r?\n([\s\S]*?)```/m

export const stepsBlockParser: BlockParser = {
  matches(block) {
    return STEPS_FENCE_REGEX.test(block)
  },
  parse(block, deckId): StepsCard[] {
    const match = block.match(STEPS_FENCE_REGEX)
    if (!match) return []

    const inner = match[1]
    const lines = inner.split('\n').map((l) => l.trim())

    const titleLine = lines.find((l) => l.startsWith('title:'))
    const title = titleLine ? titleLine.slice('title:'.length).trim() : 'Sem título'

    const steps = lines
      .filter((l) => /^\d+\.\s/.test(l))
      .map((l) => l.replace(/^\d+\.\s+/, '').trim())
      .filter(Boolean)

    if (steps.length < 2) return []

    return [
      {
        ...createNewCard(),
        id: crypto.randomUUID(),
        deckId,
        type: 'steps',
        title,
        steps,
      },
    ]
  },
}
