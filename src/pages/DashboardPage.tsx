import { useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import { BookOpen, Flame, TrendingUp, Clock, ArrowRight, Sparkles, Layers } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DeckImport } from '@/components/deck/DeckImport'
import { useDecks } from '@/hooks/useDeck'
import { useGlobalStats } from '@/hooks/useStats'
import { formatRelative } from '@/utils/dateUtils'

function StatCard({ icon: Icon, label, value, sub, color = 'text-[--color-accent]', iconBg = 'bg-[--color-accent]/15' }: {
  icon: React.ElementType
  label: string
  value: string | number
  sub?: string
  color?: string
  iconBg?: string
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-[--color-text-subtle] uppercase tracking-wider">{label}</p>
            <p className={`mt-1.5 text-2xl font-bold ${color}`}>{value}</p>
            {sub && <p className="mt-0.5 text-xs text-[--color-text-subtle]">{sub}</p>}
          </div>
          <div className={`rounded-lg ${iconBg} p-2.5`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function DashboardPage() {
  const navigate = useNavigate()
  const decks = useDecks()
  const { dueToday, reviewedToday, streak, totalReviewed, retention } = useGlobalStats()
  const recentDecks = decks.slice(0, 4)

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold text-[--color-text]">Início</h1>
        <p className="mt-1 text-sm text-[--color-text-muted]">
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </motion.div>

      {decks.length === 0 ? (
        /* Empty state hero */
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center py-12 text-center"
        >
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[--color-accent]/15">
            <Layers className="h-8 w-8 text-[--color-accent]" />
          </div>
          <h2 className="text-xl font-semibold text-[--color-text]">
            Estude qualquer tema com cartões inteligentes
          </h2>
          <p className="mt-2 max-w-sm text-sm text-[--color-text-muted]">
            Importe um arquivo <code className="rounded bg-[--color-surface-2] px-1 py-0.5 text-xs">.deck.md</code> ou gere um deck com IA em segundos.
          </p>
          <div className="mt-10 w-full max-w-lg">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-[--color-border-subtle] bg-[--color-surface] p-5">
                <p className="mb-4 text-sm font-medium text-[--color-text]">Importar arquivo</p>
                <DeckImport />
              </div>
              <button
                type="button"
                onClick={() => navigate('/ai-prompt')}
                className="group flex flex-col items-center justify-center gap-4 rounded-xl border border-[--color-border-subtle] bg-[--color-surface] p-10 text-center transition-colors hover:border-[--color-accent]/40 hover:bg-[--color-surface-2]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[--color-surface-2] transition-colors group-hover:bg-[--color-accent]/15">
                  <Sparkles className="h-6 w-6 text-[--color-accent]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[--color-text]">Criar com IA</p>
                  <p className="mt-0.5 text-xs text-[--color-text-subtle]">Use um prompt pronto com qualquer LLM</p>
                </div>
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8"
          >
            <StatCard icon={BookOpen} label="Devidos hoje" value={dueToday} sub="cartões para revisar" color="text-[--color-accent]" iconBg="bg-[--color-accent]/15" />
            <StatCard icon={Clock} label="Revisados hoje" value={reviewedToday} color="text-blue-400" iconBg="bg-blue-500/10" />
            <StatCard icon={Flame} label="Sequência" value={`${streak}d`} sub="dias consecutivos" color="text-orange-400" iconBg="bg-orange-500/10" />
            <StatCard
              icon={TrendingUp}
              label="Retenção"
              value={totalReviewed === 0 ? '–' : `${retention}%`}
              sub={totalReviewed === 0 ? 'Estude para ver' : `${totalReviewed} revisões`}
              color="text-[--color-success]"
              iconBg="bg-[--color-success]/10"
            />
          </motion.div>

          {/* Estudar tudo CTA */}
          {dueToday > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <Button className="w-full h-12 text-base gap-2" onClick={() => navigate('/study/all')}>
                <Flame className="h-5 w-5" />
                Revisar {dueToday} {dueToday === 1 ? 'cartão' : 'cartões'} de hoje
              </Button>
            </motion.div>
          )}

          {/* Recent decks */}
          {recentDecks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[--color-text]">Decks recentes</h2>
                <Button variant="ghost" size="sm" onClick={() => navigate('/library')}>
                  Ver todos <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {recentDecks.map((deck) => (
                  <Card
                    key={deck.id}
                    className="cursor-pointer hover:border-[--color-border] transition-colors"
                    onClick={() => navigate(`/study/${deck.id}`)}
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[--color-text]">{deck.title}</p>
                        <p className="text-xs text-[--color-text-subtle]">
                          {deck.lastStudied ? formatRelative(deck.lastStudied) : 'Nunca estudado'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {deck.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                        <ArrowRight className="h-4 w-4 text-[--color-text-subtle]" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}
