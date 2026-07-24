import { Progress } from '@/components/ui/progress'

interface StudyProgressProps {
  current: number
  total: number
}

export function StudyProgress({ current, total }: StudyProgressProps) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0

  return <Progress value={pct} className="h-1.5 w-full" />
}
