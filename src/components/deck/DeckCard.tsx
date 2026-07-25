import { useState } from 'react'
import { useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import {
  BookOpen, Heart, HeartOff, MoreHorizontal, Trash2, Copy, Pencil, Play,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useDeckStats } from '@/hooks/useStats'
import { useDeckActions } from '@/hooks/useDeck'
import { formatRelative } from '@/utils/dateUtils'
import type { Deck } from '@/models/Deck'

interface DeckCardProps {
  deck: Deck
}

export function DeckCard({ deck }: DeckCardProps) {
  const navigate = useNavigate()
  const { total, reviewed, progress } = useDeckStats(deck.id)
  const { renameDeck, toggleFavorite, removeDeck, copyDeck } = useDeckActions()
  const [renameOpen, setRenameOpen] = useState(false)
  const [newTitle, setNewTitle] = useState(deck.title)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const handleRename = async () => {
    if (newTitle.trim()) {
      await renameDeck(deck.id, newTitle.trim())
    }
    setRenameOpen(false)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="group hover:-translate-y-px hover:border-[var(--color-border)] transition-all duration-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold text-[var(--color-text)]">{deck.title}</h3>
                {deck.description && (
                  <p className="mt-0.5 text-xs text-[var(--color-text-subtle)] line-clamp-1">
                    {deck.description}
                  </p>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 opacity-50 hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem onClick={() => navigate(`/study/${deck.id}`)}>
                    <Play className="h-4 w-4" /> Estudar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setNewTitle(deck.title); setRenameOpen(true) }}>
                    <Pencil className="h-4 w-4" /> Renomear
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => copyDeck(deck.id)}>
                    <Copy className="h-4 w-4" /> Duplicar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toggleFavorite(deck)}>
                    {deck.isFavorite ? (
                      <><HeartOff className="h-4 w-4" /> Remover favorito</>
                    ) : (
                      <><Heart className="h-4 w-4" /> Favoritar</>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-[var(--color-danger)] focus:text-[var(--color-danger)] focus:bg-[var(--color-danger)]/10"
                    onClick={() => setDeleteOpen(true)}
                  >
                    <Trash2 className="h-4 w-4" /> Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Tags */}
            {deck.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {deck.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {deck.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">+{deck.tags.length - 3}</Badge>
                )}
              </div>
            )}

            {/* Progress */}
            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between text-xs text-[var(--color-text-subtle)]">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="h-3 w-3" />
                  {total} cartões
                </span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-1" />
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-[var(--color-text-subtle)]">
                {deck.lastStudied ? `Estudado ${formatRelative(deck.lastStudied)}` : 'Nunca estudado'}
              </span>
              <Button size="sm" onClick={() => navigate(`/study/${deck.id}`)}>
                <Play className="h-3.5 w-3.5" />
                Estudar
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Delete confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir deck</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O deck "{deck.title}" e todo o progresso
              associado serão removidos permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-[var(--color-danger)] hover:bg-[var(--color-danger)]/80 text-white"
              onClick={() => removeDeck(deck.id)}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rename dialog */}
      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Renomear deck</DialogTitle>
          </DialogHeader>
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRename()}
            placeholder="Nome do deck"
            autoFocus
          />
          <DialogFooter>
            <Button variant="secondary" onClick={() => setRenameOpen(false)}>Cancelar</Button>
            <Button onClick={handleRename}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
