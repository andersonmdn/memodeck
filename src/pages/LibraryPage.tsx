import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, Heart, Library } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DeckCard } from '@/components/deck/DeckCard'
import { DeckImport } from '@/components/deck/DeckImport'
import { useDecks } from '@/hooks/useDeck'
import { cn } from '@/utils/cn'

export function LibraryPage() {
  const decks = useDecks()
  const [search, setSearch] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [importOpen, setImportOpen] = useState(false)

  const allTags: string[] = useMemo(() => {
    const tags = decks.flatMap((d) => d.tags as string[])
    return [...new Set(tags)].sort()
  }, [decks])

  const filtered = useMemo(() => {
    return decks.filter((d) => {
      const matchesSearch =
        !search ||
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        d.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      const matchesTags =
        selectedTags.length === 0 || selectedTags.every((t) => d.tags.includes(t))
      return matchesSearch && matchesTags
    })
  }, [decks, search, selectedTags])

  const favorites = filtered.filter((d) => d.isFavorite)
  const rest = filtered.filter((d) => !d.isFavorite)

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    )
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-start justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-[--color-text]">Biblioteca</h1>
          <p className="mt-1 text-sm text-[--color-text-muted]">
            {decks.length} {decks.length === 1 ? 'deck' : 'decks'} importados
          </p>
        </div>
        <Button onClick={() => setImportOpen(true)}>
          <Plus className="h-4 w-4" /> Importar deck
        </Button>
      </motion.div>

      {/* Search + Tags */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-6 space-y-3"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[--color-text-subtle]" />
          <Input
            placeholder="Buscar decks ou tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button key={tag} onClick={() => toggleTag(tag)}>
                <Badge
                  variant={selectedTags.includes(tag) ? 'default' : 'secondary'}
                  className={cn(
                    'cursor-pointer transition-colors',
                    selectedTags.includes(tag) && 'ring-1 ring-[--color-accent]',
                  )}
                >
                  {tag}
                </Badge>
              </button>
            ))}
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className="text-xs text-[--color-text-subtle] hover:text-[--color-text] transition-colors"
              >
                Limpar filtros
              </button>
            )}
          </div>
        )}
      </motion.div>

      {/* Favorites */}
      {favorites.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="mb-3 flex items-center gap-2">
            <Heart className="h-4 w-4 text-rose-400" />
            <h2 className="text-sm font-semibold text-[--color-text]">Favoritos</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((deck) => (
              <DeckCard key={deck.id} deck={deck} />
            ))}
          </div>
        </motion.section>
      )}

      {/* All decks */}
      {rest.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {favorites.length > 0 && (
            <div className="mb-3 flex items-center gap-2">
              <Library className="h-4 w-4 text-[--color-text-subtle]" />
              <h2 className="text-sm font-semibold text-[--color-text]">Todos os decks</h2>
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((deck) => (
              <DeckCard key={deck.id} deck={deck} />
            ))}
          </div>
        </motion.section>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[--color-border] py-20 text-center"
        >
          <Library className="mb-3 h-10 w-10 text-[--color-text-subtle]" />
          {decks.length === 0 ? (
            <>
              <p className="text-sm font-medium text-[--color-text]">Biblioteca vazia</p>
              <p className="mt-1 text-xs text-[--color-text-subtle]">
                Importe seu primeiro deck para começar
              </p>
              <Button className="mt-4" size="sm" onClick={() => setImportOpen(true)}>
                <Plus className="h-4 w-4" /> Importar deck
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-[--color-text]">Nenhum resultado</p>
              <p className="mt-1 text-xs text-[--color-text-subtle]">
                Tente outros termos ou remova os filtros
              </p>
            </>
          )}
        </motion.div>
      )}

      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importar deck</DialogTitle>
          </DialogHeader>
          <DeckImport onImported={() => setImportOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
