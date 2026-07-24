import { describe, it, expect } from 'vitest'
import { parseDeckText } from '../deckParser'

const SAMPLE_DECK = `---
title: AWS IAM
description: Conceitos básicos
tags:
  - aws
  - security
version: 1
---

# IAM

O {{c1::IAM}} controla identidades.

A política {{c2::AdministratorAccess}} concede permissões administrativas.

O {{c3::CloudTrail}} registra chamadas de API.
`

describe('parseDeckText', () => {
  it('extrai metadados do frontmatter', () => {
    const { deck } = parseDeckText(SAMPLE_DECK)
    expect(deck.title).toBe('AWS IAM')
    expect(deck.description).toBe('Conceitos básicos')
    expect(deck.tags).toEqual(['aws', 'security'])
    expect(deck.version).toBe(1)
  })

  it('gera um card por cloze', () => {
    const { cards } = parseDeckText(SAMPLE_DECK)
    expect(cards).toHaveLength(3)
  })

  it('cards têm a resposta correta', () => {
    const { cards } = parseDeckText(SAMPLE_DECK)
    const answers = cards.map((c) => c.answer)
    expect(answers).toContain('IAM')
    expect(answers).toContain('AdministratorAccess')
    expect(answers).toContain('CloudTrail')
  })

  it('deck recebe isFavorite false e importedAt', () => {
    const { deck } = parseDeckText(SAMPLE_DECK)
    expect(deck.isFavorite).toBe(false)
    expect(deck.importedAt).toBeInstanceOf(Date)
  })

  it('emite warning para deck sem clozes', () => {
    const { warnings } = parseDeckText('---\ntitle: Vazio\n---\nSem cloze aqui.')
    expect(warnings.some((w) => w.includes('Nenhum cloze'))).toBe(true)
  })

  it('usa título padrão se frontmatter não tem title', () => {
    const { deck, warnings } = parseDeckText('---\n---\n{{c1::x}}')
    expect(deck.title).toBe('Deck sem título')
    expect(warnings.some((w) => w.includes('Título'))).toBe(true)
  })

  it('múltiplos parágrafos geram cards independentes', () => {
    const text = `---
title: Test
---

{{c1::A}} é importante.

{{c1::B}} é diferente.
`
    const { cards } = parseDeckText(text)
    expect(cards).toHaveLength(2)
  })
})
