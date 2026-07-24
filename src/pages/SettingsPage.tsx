import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Upload, Trash2, CheckCircle, AlertCircle, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { exportAllData, importBackup, resetAllData } from '@/utils/exportImport'

type Feedback = { type: 'success' | 'error'; message: string } | null

export function SettingsPage() {
  const importRef = useRef<HTMLInputElement>(null)
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [importConfirmOpen, setImportConfirmOpen] = useState(false)

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message })
    setTimeout(() => setFeedback(null), 4000)
  }

  const handleExport = async () => {
    try {
      await exportAllData()
      showFeedback('success', 'Backup exportado com sucesso!')
    } catch {
      showFeedback('error', 'Erro ao exportar dados.')
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const result = await importBackup(file)
    showFeedback(result.ok ? 'success' : 'error', result.message)
    e.target.value = ''
  }

  const handleReset = async () => {
    await resetAllData()
    showFeedback('success', 'Todos os dados foram apagados.')
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold text-[--color-text]">Configurações</h1>
        <p className="mt-1 text-sm text-[--color-text-muted]">Gerencie seus dados e preferências</p>
      </motion.div>

      {/* Feedback */}
      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-4 flex items-center gap-2 rounded-lg border p-3 text-sm ${
            feedback.type === 'success'
              ? 'border-[--color-success]/30 bg-[--color-success]/10 text-[--color-success]'
              : 'border-[--color-danger]/30 bg-[--color-danger]/10 text-[--color-danger]'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
          )}
          {feedback.message}
        </motion.div>
      )}

      <div className="space-y-4">
        {/* Privacy notice */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[--color-success]/15">
                <Shield className="h-3.5 w-3.5 text-[--color-success]" />
              </div>
              <CardTitle className="text-sm">Privacidade total</CardTitle>
            </div>
            <CardDescription>
              Nenhum dado é enviado para qualquer servidor. Todo o processamento e armazenamento
              ocorre exclusivamente no seu navegador, usando IndexedDB.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Export */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Exportar backup</CardTitle>
            <CardDescription>
              Baixe todos os seus decks, cartões e progresso como um arquivo JSON.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button variant="secondary" onClick={handleExport}>
              <Download className="h-4 w-4" /> Exportar dados
            </Button>
          </CardContent>
        </Card>

        {/* Import */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Restaurar backup</CardTitle>
            <CardDescription>
              Importe um arquivo de backup JSON. Os dados existentes serão mesclados.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <input
              ref={importRef}
              type="file"
              accept=".json"
              className="sr-only"
              onChange={handleImport}
            />
            <Button variant="secondary" onClick={() => setImportConfirmOpen(true)}>
              <Upload className="h-4 w-4" /> Importar backup
            </Button>
          </CardContent>
        </Card>

        <AlertDialog open={importConfirmOpen} onOpenChange={setImportConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Restaurar backup?</AlertDialogTitle>
              <AlertDialogDescription>
                Os dados do arquivo serão mesclados com seus dados atuais. Decks, cartões e
                progresso existentes não serão removidos.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setImportConfirmOpen(false)
                  importRef.current?.click()
                }}
              >
                Selecionar arquivo
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Reset */}
        <Card className="border-[--color-danger]/20">
          <CardHeader>
            <CardTitle className="text-sm text-[--color-danger]">Zona de perigo</CardTitle>
            <CardDescription>
              Estas ações são irreversíveis. Faça um backup antes de prosseguir.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4" /> Apagar todos os dados
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Apagar todos os dados?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação removerá permanentemente todos os decks, cartões, histórico e
                    progresso. Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-[--color-danger] hover:bg-[--color-danger]/80 text-white"
                    onClick={handleReset}
                  >
                    Sim, apagar tudo
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
