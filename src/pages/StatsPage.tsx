import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Flame, TrendingUp, BookOpen, BarChart2, ListOrdered, CheckCircle2, XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGlobalStats, useDeckStats, useStepsStats } from '@/hooks/useStats'
import { useDecks } from '@/hooks/useDeck'
import type { Deck } from '@/models/Deck'

function DeckStatRow({ deck }: { deck: Deck }) {
  const { total, reviewed, progress, retention } = useDeckStats(deck.id)
  return (
    <div className="flex items-center gap-4 py-3 border-b border-[var(--color-border-subtle)] last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <p className="truncate text-sm font-medium text-[var(--color-text)]">{deck.title}</p>
          {deck.contentTypes?.includes('steps') && (
            <span className="shrink-0 inline-flex items-center rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400">
              Steps
            </span>
          )}
        </div>
        <p className="text-xs text-[var(--color-text-subtle)]">{reviewed}/{total} revisados</p>
      </div>
      <div className="flex items-center gap-4 shrink-0 text-xs">
        <span className="text-[var(--color-accent)] font-medium">{progress}%</span>
        <span className="text-[var(--color-success)] font-medium">{retention}% ret.</span>
      </div>
    </div>
  )
}

interface TooltipPayload {
  value: number
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs shadow-lg">
      <p className="text-[var(--color-text-muted)]">{label}</p>
      <p className="font-semibold text-[var(--color-text)]">{payload[0].value} revisões</p>
    </div>
  )
}

export function StatsPage() {
  const { streak, totalReviewed, retention, reviewedToday, last30Days } = useGlobalStats()
  const { total: stepsTotal, totalReviews: stepsReviews, correct: stepsCorrect, incorrect: stepsIncorrect, accuracy: stepsAccuracy } = useStepsStats()
  const decks = useDecks()

  const maxCount = Math.max(...last30Days.map((d) => d.count), 1)

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Estatísticas</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">Seu progresso de estudo</p>
      </motion.div>

      {/* Summary cards */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8"
      >
        {[
          { icon: Flame, label: 'Sequência', value: `${streak}d`, color: 'text-orange-400', iconBg: 'bg-orange-500/10' },
          { icon: BookOpen, label: 'Hoje', value: reviewedToday, color: 'text-blue-400', iconBg: 'bg-blue-500/10' },
          { icon: TrendingUp, label: 'Total', value: totalReviewed, color: 'text-[var(--color-accent)]', iconBg: 'bg-[var(--color-accent)]/15' },
          { icon: BarChart2, label: 'Retenção', value: totalReviewed === 0 ? '–' : `${retention}%`, color: 'text-[var(--color-success)]', iconBg: 'bg-[var(--color-success)]/10' },
        ].map(({ icon: Icon, label, value, color, iconBg }) => (
          <Card key={label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[var(--color-text-subtle)] uppercase tracking-wider">{label}</p>
                  <p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
                </div>
                <div className={`rounded-lg ${iconBg} p-2`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Revisões — últimos 30 dias</CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            {totalReviewed === 0 ? (
              <div className="flex h-40 items-center justify-center text-sm text-[var(--color-text-subtle)]">
                Nenhuma revisão ainda
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={last30Days} barSize={8} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                  <XAxis
                    dataKey="date"
                    tick={{ fill: 'var(--color-text-subtle)', fontSize: 10 }}
                    interval={4}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'var(--color-text-subtle)', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.08)' }} />
                  <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                    {last30Days.map((entry, index) => (
                      <Cell
                        key={index}
                        fill="var(--color-accent)"
                        fillOpacity={entry.count === 0 ? 0.08 : Math.max(0.25, entry.count / maxCount)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Steps stats */}
      {stepsTotal > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/15">
                  <ListOrdered className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <CardTitle className="text-sm">Exercícios Steps</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-lg bg-[var(--color-surface-2)] p-4">
                  <p className="text-xs text-[var(--color-text-subtle)] uppercase tracking-wider">Sequências</p>
                  <p className="mt-1 text-2xl font-bold text-emerald-400">{stepsTotal}</p>
                </div>
                <div className="rounded-lg bg-[var(--color-surface-2)] p-4">
                  <p className="text-xs text-[var(--color-text-subtle)] uppercase tracking-wider">Revisões</p>
                  <p className="mt-1 text-2xl font-bold text-[var(--color-text)]">{stepsReviews}</p>
                </div>
                <div className="rounded-lg bg-[var(--color-surface-2)] p-4">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[var(--color-success)]" />
                    <p className="text-xs text-[var(--color-text-subtle)] uppercase tracking-wider">Acertos</p>
                  </div>
                  <p className="mt-1 text-2xl font-bold text-[var(--color-success)]">{stepsCorrect}</p>
                </div>
                <div className="rounded-lg bg-[var(--color-surface-2)] p-4">
                  <div className="flex items-center gap-1.5">
                    <XCircle className="h-3.5 w-3.5 text-[var(--color-danger)]" />
                    <p className="text-xs text-[var(--color-text-subtle)] uppercase tracking-wider">Erros</p>
                  </div>
                  <p className="mt-1 text-2xl font-bold text-[var(--color-danger)]">{stepsIncorrect}</p>
                </div>
              </div>
              {stepsReviews > 0 && (
                <p className="mt-3 text-xs text-[var(--color-text-subtle)]">
                  Precisão: <span className="font-medium text-[var(--color-text)]">{stepsAccuracy}%</span> dos exercícios concluídos corretamente
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Per-deck stats */}
      {decks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Por deck</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {decks.map((deck) => (
                <DeckStatRow key={deck.id} deck={deck} />
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
