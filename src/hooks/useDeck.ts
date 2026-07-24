import { useState, useCallback } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/storage/db'
import {
  getAllDecks,
  getDeckById,
  getCardsByDeckId,
  updateDeck,
  deleteDeck,
  duplicateDeck,
  saveImportedDeck,
} from '@/storage/deckStore'
import { parseDeckFile } from '@/parser/deckParser'
import type { Deck } from '@/models/Deck'
import type { Card } from '@/models/Card'

export function useDecks(): Deck[] {
  const decks: Deck[] = useLiveQuery(() => getAllDecks(), []) ?? []
  return decks
}

export function useDeck(id: string) {
  const deck: Deck | undefined = useLiveQuery(() => getDeckById(id), [id])
  const cards: Card[] = useLiveQuery(() => getCardsByDeckId(id), [id]) ?? []
  return { deck, cards }
}

export function useDeckActions() {
  const [importing, setImporting] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)

  const importFile = useCallback(async (file: File): Promise<{ ok: boolean; warnings: string[] }> => {
    setImporting(true)
    setImportError(null)
    try {
      const { deck, cards, warnings } = await parseDeckFile(file)
      await saveImportedDeck(deck, cards)
      return { ok: true, warnings }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao importar deck'
      setImportError(msg)
      return { ok: false, warnings: [msg] }
    } finally {
      setImporting(false)
    }
  }, [])

  const renameDeck = useCallback(async (id: string, title: string) => {
    await updateDeck(id, { title })
  }, [])

  const toggleFavorite = useCallback(async (deck: Deck) => {
    await updateDeck(deck.id, { isFavorite: !deck.isFavorite })
  }, [])

  const removeDeck = useCallback(async (id: string) => {
    await deleteDeck(id)
  }, [])

  const copyDeck = useCallback(async (id: string) => {
    return duplicateDeck(id)
  }, [])

  return { importing, importError, importFile, renameDeck, toggleFavorite, removeDeck, copyDeck }
}

export function useAllDecks(): Deck[] {
  return useLiveQuery(() => db.decks.toArray(), []) ?? []
}
