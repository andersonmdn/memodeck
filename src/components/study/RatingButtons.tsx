import { motion } from 'framer-motion'
import type { Rating } from '@/models/Card'

const RATINGS: { value: Rating; label: string; description: string; color: string; key: string }[] = [
  { value: 1, label: 'Errei', description: 'Não lembrei', color: 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20', key: '1' },
  { value: 2, label: 'Difícil', description: 'Com esforço', color: 'bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20', key: '2' },
  { value: 3, label: 'Bom', description: 'Lembrei', color: 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20', key: '3' },
  { value: 4, label: 'Fácil', description: 'Sem dúvida', color: 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20', key: '4' },
]

interface RatingButtonsProps {
  onRate: (rating: Rating) => void
}

export function RatingButtons({ onRate }: RatingButtonsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="grid grid-cols-4 gap-3 w-full"
    >
      {RATINGS.map(({ value, label, description, color, key }) => (
        <button
          key={value}
          onClick={() => onRate(value)}
          className={`flex flex-col items-center gap-1 rounded-lg border p-3 text-center transition-all duration-150 cursor-pointer ${color}`}
        >
          <div className="flex items-center gap-1">
            <span className="text-xs font-mono opacity-60">[{key}]</span>
          </div>
          <span className="text-sm font-semibold">{label}</span>
          <span className="text-xs opacity-70">{description}</span>
        </button>
      ))}
    </motion.div>
  )
}
