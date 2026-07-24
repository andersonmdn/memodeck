import { Progress } from '@/components/ui/progress'

interface StudyProgressProps {
  current: number
  total: number
}

export function StudyProgress({ current, total }: StudyProgressProps) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0

  return (
    <div className="flex items-center gap-4">
      <Progress value={pct} className="h-1.5 flex-1" />
      <span className="text-xs tabular-nums text-[--color-text-subtle] flex-shrink-0">
        {current}/{total}
      </span>
    </div>
  )
}
