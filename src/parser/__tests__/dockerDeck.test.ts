import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { parseDeckText } from '../deckParser'

const raw = readFileSync(
  resolve(process.cwd(), 'examples/docker-containers.deck.md'),
  'utf-8',
)
const lfContent = raw.replace(/\r\n/g, '\n')
const crlfContent = lfContent.replace(/\n/g, '\r\n')

const EXPECTED_CARDS = 29

describe('docker-containers.deck.md', () => {
  it('extrai frontmatter corretamente', () => {
    const { deck } = parseDeckText(lfContent)
    expect(deck.title).toBe('Docker & Containers')
    expect(deck.tags).toContain('docker')
    expect(deck.version).toBe(1)
  })

  it(`gera ${EXPECTED_CARDS} cards com LF`, () => {
    const { cards } = parseDeckText(lfContent)
    expect(cards).toHaveLength(EXPECTED_CARDS)
  })

  it(`gera ${EXPECTED_CARDS} cards com CRLF (arquivo salvo no Windows)`, () => {
    const { cards } = parseDeckText(crlfContent)
    expect(cards).toHaveLength(EXPECTED_CARDS)
  })
})
