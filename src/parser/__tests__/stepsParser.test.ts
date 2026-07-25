import { describe, it, expect } from 'vitest'
import { parseDeckText } from '../deckParser'
import { stepsBlockParser } from '../stepsBlockParser'
import type { StepsCard, ClozeCard } from '@/models/Card'

// ── stepsBlockParser unit tests ──────────────────────────────────────────────

describe('stepsBlockParser.matches', () => {
  it('detecta bloco steps válido', () => {
    const block = '```steps\ntitle: Deploy\n\n1. Passo um\n2. Passo dois\n```'
    expect(stepsBlockParser.matches(block)).toBe(true)
  })

  it('não detecta parágrafo cloze comum', () => {
    expect(stepsBlockParser.matches('O {{c1::IAM}} controla identidades.')).toBe(false)
  })

  it('não detecta bloco de código com outra linguagem', () => {
    expect(stepsBlockParser.matches('```typescript\nconst x = 1\n```')).toBe(false)
  })
})

describe('stepsBlockParser.parse', () => {
  const deckId = 'test-deck-id'

  it('retorna StepsCard com title e steps corretos', () => {
    const block = '```steps\ntitle: Deploy em Produção\n\n1. Criar branch\n2. Abrir PR\n3. Merge\n```'
    const cards = stepsBlockParser.parse(block, deckId)
    expect(cards).toHaveLength(1)
    const card = cards[0] as StepsCard
    expect(card.type).toBe('steps')
    expect(card.title).toBe('Deploy em Produção')
    expect(card.steps).toEqual(['Criar branch', 'Abrir PR', 'Merge'])
    expect(card.deckId).toBe(deckId)
    expect(card.state).toBe('new')
    expect(card.reviewCount).toBe(0)
  })

  it('usa "Sem título" quando title está ausente', () => {
    const block = '```steps\n1. Passo um\n2. Passo dois\n3. Passo três\n```'
    const cards = stepsBlockParser.parse(block, deckId)
    expect(cards).toHaveLength(1)
    expect((cards[0] as StepsCard).title).toBe('Sem título')
  })

  it('retorna [] quando há menos de 2 steps', () => {
    const block = '```steps\ntitle: Processo\n\n1. Único passo\n```'
    const cards = stepsBlockParser.parse(block, deckId)
    expect(cards).toHaveLength(0)
  })

  it('retorna [] para bloco steps vazio', () => {
    const block = '```steps\ntitle: Vazio\n```'
    const cards = stepsBlockParser.parse(block, deckId)
    expect(cards).toHaveLength(0)
  })

  it('extrai steps com números variados', () => {
    const block = '```steps\ntitle: Processo\n\n1. Um\n2. Dois\n3. Três\n4. Quatro\n5. Cinco\n```'
    const cards = stepsBlockParser.parse(block, deckId)
    expect((cards[0] as StepsCard).steps).toHaveLength(5)
  })
})

// ── parseDeckText integration tests ─────────────────────────────────────────

const MIXED_DECK = `---
title: "Deck Misto"
description: "Cloze e Steps juntos"
tags:
  - teste
version: 1
---

# Conceitos

O {{c1::IAM}} controla identidades na AWS.

A porta padrão do HTTPS é {{c1::443}}.

# Processo

\`\`\`steps
title: Deploy em Produção

1. Criar branch release
2. Abrir Pull Request
3. Aprovação do Tech Lead
4. Merge na main
5. Validar monitoramento
\`\`\`
`

describe('parseDeckText — arquivo misto', () => {
  it('gera cartões cloze E steps a partir do mesmo arquivo', () => {
    const { cards, warnings } = parseDeckText(MIXED_DECK)
    const clozeCards = cards.filter((c) => c.type === 'cloze')
    const stepsCards = cards.filter((c) => c.type === 'steps')
    expect(clozeCards.length).toBeGreaterThan(0)
    expect(stepsCards.length).toBe(1)
    expect(warnings).toHaveLength(0)
  })

  it('deck recebe contentTypes com ambos os tipos', () => {
    const { deck } = parseDeckText(MIXED_DECK)
    expect(deck.contentTypes).toContain('cloze')
    expect(deck.contentTypes).toContain('steps')
  })

  it('StepsCard do deck misto tem os steps corretos', () => {
    const { cards } = parseDeckText(MIXED_DECK)
    const stepsCard = cards.find((c) => c.type === 'steps') as StepsCard
    expect(stepsCard.title).toBe('Deploy em Produção')
    expect(stepsCard.steps).toHaveLength(5)
    expect(stepsCard.steps[0]).toBe('Criar branch release')
    expect(stepsCard.steps[4]).toBe('Validar monitoramento')
  })

  it('ClozeCards do deck misto têm type=cloze e reviewCount=0', () => {
    const { cards } = parseDeckText(MIXED_DECK)
    const clozeCards = cards.filter((c) => c.type === 'cloze') as ClozeCard[]
    clozeCards.forEach((c) => {
      expect(c.type).toBe('cloze')
      expect(c.reviewCount).toBe(0)
      expect(c.rawText).toBeTruthy()
      expect(c.answer).toBeTruthy()
    })
  })
})

describe('parseDeckText — deck só com steps', () => {
  const STEPS_ONLY_DECK = `---
title: "Só Steps"
version: 1
---

\`\`\`steps
title: Processo A

1. Passo 1
2. Passo 2
3. Passo 3
\`\`\`

\`\`\`steps
title: Processo B

1. Alpha
2. Beta
3. Gamma
\`\`\`
`
  it('gera um StepsCard por bloco', () => {
    const { cards } = parseDeckText(STEPS_ONLY_DECK)
    expect(cards.filter((c) => c.type === 'steps')).toHaveLength(2)
  })

  it('contentTypes contém apenas steps', () => {
    const { deck } = parseDeckText(STEPS_ONLY_DECK)
    expect(deck.contentTypes).toEqual(['steps'])
  })
})
