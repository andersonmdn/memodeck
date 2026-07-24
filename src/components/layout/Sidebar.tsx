import { useState } from 'react'
import { NavLink } from 'react-router'
import { LayoutDashboard, Library, BarChart2, Settings, HardDrive, Layers, Sparkles } from 'lucide-react'
import { cn } from '@/utils/cn'

interface NavItem {
  to: string
  icon: React.ElementType
  label: string
  end?: boolean
  newFeature?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', icon: LayoutDashboard, label: 'Início', end: true },
  { to: '/library', icon: Library, label: 'Biblioteca' },
  { to: '/ai-prompt', icon: Sparkles, label: 'Criar com IA', newFeature: true },
  { to: '/stats', icon: BarChart2, label: 'Estatísticas' },
  { to: '/settings', icon: Settings, label: 'Configurações' },
]

export function Sidebar() {
  const [aiBadgeSeen, setAiBadgeSeen] = useState(
    () => !!localStorage.getItem('memodeck-ai-nav-seen'),
  )

  return (
    <aside className="flex h-screen w-56 flex-col border-r border-[--color-border-subtle] bg-[--color-surface] px-3 py-4">
      {/* Logo */}
      <div className="mb-6 flex items-center gap-2.5 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[--color-accent] shadow-lg shadow-indigo-500/30">
          <Layers className="h-4 w-4 text-white" />
        </div>
        <span className="text-base font-semibold tracking-tight text-[--color-text]">
          MemoDeck
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5">
        {NAV_ITEMS.map(({ to, icon: Icon, label, end, newFeature }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => {
              if (newFeature && !aiBadgeSeen) {
                localStorage.setItem('memodeck-ai-nav-seen', '1')
                setAiBadgeSeen(true)
              }
            }}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[--color-accent]/15 text-[--color-accent]'
                  : 'text-[--color-text-muted] hover:bg-[--color-surface-2] hover:text-[--color-text]',
              )
            }
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            <span className="flex-1">{label}</span>
            {newFeature && !aiBadgeSeen && (
              <span className="inline-flex items-center rounded-full bg-[--color-accent]/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[--color-accent]">
                Novo
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom hint */}
      <div className="mt-4 rounded-lg border border-[--color-accent]/15 bg-[--color-accent]/5 p-3">
        <div className="flex items-center gap-2 text-xs text-[--color-text-subtle]">
          <HardDrive className="h-3.5 w-3.5 flex-shrink-0 text-[--color-accent]/60" />
          <span>Dados salvos localmente</span>
        </div>
      </div>
    </aside>
  )
}
