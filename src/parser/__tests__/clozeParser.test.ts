import { describe, it, expect } from 'vitest'
import { extractClozes, buildCards, renderClozeText } from '../clozeParser'
import { renderClozeMarkdown } from '../markdownRenderer'

describe('extractClozes', () => {
  it('extrai clozes simples', () => {
    const clozes = extractClozes('O {{c1::IAM}} controla identidades.')
    expect(clozes).toEqual([{ index: 1, answer: 'IAM' }])
  })

  it('extrai múltiplos clozes do mesmo parágrafo', () => {
    const clozes = extractClozes('{{c1::A}} e {{c2::B}} e {{c3::C}}')
    expect(clozes).toHaveLength(3)
    expect(clozes.map((c) => c.index)).toEqual([1, 2, 3])
  })

  it('não duplica cloze com mesmo índice', () => {
    const clozes = extractClozes('{{c1::x}} e {{c1::y}}')
    expect(clozes).toHaveLength(1)
    expect(clozes[0].answer).toBe('x')
  })

  it('retorna lista vazia para texto sem cloze', () => {
    expect(extractClozes('Texto sem cloze algum.')).toEqual([])
  })

  it('lida com respostas multi-word', () => {
    const clozes = extractClozes('{{c1::AWS IAM}} controla identidades')
    expect(clozes[0].answer).toBe('AWS IAM')
  })
})

describe('buildCards', () => {
  it('gera um card por cloze único', () => {
    const cards = buildCards('deck-1', 'O {{c1::IAM}} e o {{c2::CloudTrail}} existem.')
    expect(cards).toHaveLength(2)
    expect(cards[0].clozeIndex).toBe(1)
    expect(cards[0].answer).toBe('IAM')
    expect(cards[1].clozeIndex).toBe(2)
    expect(cards[1].answer).toBe('CloudTrail')
  })

  it('card tem deckId correto', () => {
    const cards = buildCards('meu-deck', '{{c1::teste}}')
    expect(cards[0].deckId).toBe('meu-deck')
  })

  it('card começa com state "new"', () => {
    const cards = buildCards('d', '{{c1::x}}')
    expect(cards[0].state).toBe('new')
  })

  it('cada card tem id único', () => {
    const cards = buildCards('d', '{{c1::A}} {{c2::B}} {{c3::C}}')
    const ids = cards.map((c) => c.id)
    expect(new Set(ids).size).toBe(3)
  })
})

describe('renderClozeText', () => {
  const text = 'O {{c1::IAM}} e o {{c2::CloudTrail}} existem.'

  it('oculta cloze ativo antes de revelar', () => {
    const html = renderClozeText(text, 1, false)
    expect(html).toContain('cloze-blank')
    expect(html).not.toContain('IAM')
  })

  it('revela cloze ativo após mostrar resposta', () => {
    const html = renderClozeText(text, 1, true)
    expect(html).toContain('cloze-revealed')
    expect(html).toContain('IAM')
  })

  it('outros clozes mostram seu texto real', () => {
    const html = renderClozeText(text, 1, false)
    expect(html).not.toContain('cloze-other')
    expect(html).toContain('CloudTrail')
  })
})

describe('renderClozeMarkdown', () => {
  it('revela cloze dentro de code span markdown', () => {
    const html = renderClozeMarkdown('status `{{c2::201}}`', 2, true)
    expect(html).toContain('cloze-revealed')
    expect(html).toContain('201')
    expect(html).not.toContain('{{c2::')
  })

  it('oculta cloze dentro de code span antes de revelar', () => {
    const html = renderClozeMarkdown('status `{{c2::201}}`', 2, false)
    expect(html).toContain('cloze-blank')
    expect(html).not.toContain('201')
  })

  it('revela cloze em texto simples normalmente', () => {
    const html = renderClozeMarkdown('O {{c1::IAM}} controla.', 1, true)
    expect(html).toContain('cloze-revealed')
    expect(html).toContain('IAM')
  })
})
