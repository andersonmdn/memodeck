import { useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react'
import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/button'
import { useDeckActions } from '@/hooks/useDeck'

interface ImportState {
  status: 'idle' | 'loading' | 'success' | 'error'
  message?: string
  warnings?: string[]
}

export function DeckImport({ onImported }: { onImported?: () => void }) {
  const [dragOver, setDragOver] = useState(false)
  const [state, setState] = useState<ImportState>({ status: 'idle' })
  const inputRef = useRef<HTMLInputElement>(null)
  const { importFile } = useDeckActions()

  const processFile = useCallback(
    async (file: File) => {
      if (!file.name.endsWith('.md') && !file.name.endsWith('.deck.md')) {
        setState({ status: 'error', message: 'Formato inválido. Use arquivos .md ou .deck.md' })
        return
      }
      const text = await file.text()
      if (!/\{\{c\d+::/.test(text)) {
        setState({
          status: 'error',
          message: 'Nenhum cartão encontrado. Use a sintaxe {{c1::resposta}} para criar cartões.',
        })
        return
      }
      setState({ status: 'loading' })
      const result = await importFile(file)
      if (result.ok) {
        setState({
          status: 'success',
          message: `Deck importado com sucesso!`,
          warnings: result.warnings,
        })
        onImported?.()
      } else {
        setState({ status: 'error', message: result.warnings[0] })
      }
    },
    [importFile, onImported],
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file) processFile(file)
    },
    [processFile],
  )

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) processFile(file)
      e.target.value = ''
    },
    [processFile],
  )

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept=".md,.deck.md"
        className="sr-only"
        onChange={onFileChange}
      />

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 transition-all duration-200',
          dragOver
            ? 'border-[--color-accent] bg-[--color-accent]/5'
            : 'border-[--color-border] hover:border-[--color-border] hover:bg-[--color-surface-2]/50',
        )}
      >
        <div className={cn(
          'flex h-12 w-12 items-center justify-center rounded-xl transition-colors',
          dragOver ? 'bg-[--color-accent]/20' : 'bg-[--color-surface-2]',
        )}>
          {state.status === 'loading' ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <FileText className="h-6 w-6 text-[--color-accent]" />
            </motion.div>
          ) : (
            <Upload className={cn('h-6 w-6', dragOver ? 'text-[--color-accent]' : 'text-[--color-text-muted]')} />
          )}
        </div>

        <div className="text-center">
          <p className="text-sm font-medium text-[--color-text]">
            {dragOver ? 'Solte o arquivo aqui' : 'Arraste um arquivo .deck.md'}
          </p>
          <p className="mt-0.5 text-xs text-[--color-text-subtle]">
            ou clique para selecionar
          </p>
        </div>
      </div>

      <AnimatePresence>
        {state.status !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className={cn(
              'mt-3 flex items-start gap-3 rounded-lg border p-3',
              state.status === 'success'
                ? 'border-[--color-success]/30 bg-[--color-success]/10'
                : state.status === 'error'
                  ? 'border-[--color-danger]/30 bg-[--color-danger]/10'
                  : 'border-[--color-border] bg-[--color-surface-2]',
            )}
          >
            {state.status === 'success' && <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[--color-success]" />}
            {state.status === 'error' && <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[--color-danger]" />}
            <div className="min-w-0 flex-1 text-sm">
              <p className={cn(
                'font-medium',
                state.status === 'success' ? 'text-[--color-success]' : 'text-[--color-danger]',
              )}>
                {state.message}
              </p>
              {state.warnings && state.warnings.length > 0 && (
                <ul className="mt-1 space-y-0.5">
                  {state.warnings.map((w, i) => (
                    <li key={i} className="text-xs text-[--color-text-muted]">• {w}</li>
                  ))}
                </ul>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 flex-shrink-0"
              onClick={(e) => { e.stopPropagation(); setState({ status: 'idle' }) }}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
