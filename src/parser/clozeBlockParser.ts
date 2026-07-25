import type { BlockParser } from './BlockParser'
import { buildCards } from './clozeParser'

const CLOZE_REGEX = /\{\{c\d+::[^}]+\}\}/

export const clozeBlockParser: BlockParser = {
  matches(block) {
    return CLOZE_REGEX.test(block)
  },
  parse(block, deckId) {
    return buildCards(deckId, block)
  },
}
