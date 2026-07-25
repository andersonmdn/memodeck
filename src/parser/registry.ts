import type { BlockParser } from './BlockParser'
import { stepsBlockParser } from './stepsBlockParser'
import { clozeBlockParser } from './clozeBlockParser'

// Ordered: first match wins. Steps checked first (unambiguous fenced blocks).
// To add a new type: create a BlockParser module and append it here.
export const blockRegistry: BlockParser[] = [stepsBlockParser, clozeBlockParser]
