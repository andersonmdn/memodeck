import { motion } from 'framer-motion'
import type { Rating } from '@/models/Card'

const RATINGS: { value: Rating; label: string; description: string; color: string; key: string }[] = [
  { value: 1, label: 'Errei', description: 'Não lembrei', color: 'bg-red-500/15 border-red-500/40 text-red-400 hover:bg-red-500/25 focus-visible:ring-red-500/60', key: '1' },
  { value: 2, label: 'Difícil', description: 'Com esforço', color: 'bg-orange-500/15 border-orange-500/40 text-orange-400 hover:bg-orange-500/25 focus-visible:ring-orange-500/60', key: '2' },
  { value: 3, label: 'Bom', description: 'Lembrei', color: 'bg-blue-500/15 border-blue-500/40 text-blue-400 hover:bg-blue-500/25 focus-visible:ring-blue-500/60', key: '3' },
  { value: 4, label: 'Fácil', description: 'Sem dúvida', color: 'bg-green-500/15 border-green-500/40 text-green-400 hover:bg-green-500/25 focus-visible:ring-green-500/60', key: '4' },
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
          className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 text-center transition-all duration-150 cursor-pointer active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-background] ${color}`}
        >
          <span className="text-sm font-semibold leading-tight">{label}</span>
          <span className="text-xs opacity-70 leading-tight">{description}</span>
          <kbd className="mt-0.5 rounded border border-white/15 bg-white/10 px-1.5 py-0.5 text-[10px] font-sans opacity-60">{key}</kbd>
        </button>
      ))}
    </motion.div>
  )
}
