import { NavLink } from 'react-router'
import { LayoutDashboard, Library, BarChart2, Settings, BookOpen, Layers, Bot } from 'lucide-react'
import { cn } from '@/utils/cn'

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/library', icon: Library, label: 'Biblioteca' },
  { to: '/stats', icon: BarChart2, label: 'Estatísticas' },
  { to: '/ai-prompt', icon: Bot, label: 'Prompt IA' },
  { to: '/settings', icon: Settings, label: 'Configurações' },
]

export function Sidebar() {
  return (
    <aside className="flex h-screen w-56 flex-col border-r border-[--color-border-subtle] bg-[--color-surface] px-3 py-4">
      {/* Logo */}
      <div className="mb-6 flex items-center gap-2.5 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[--color-accent]">
          <Layers className="h-4 w-4 text-white" />
        </div>
        <span className="text-base font-semibold tracking-tight text-[--color-text]">
          MemoDeck
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5">
        {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
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
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom hint */}
      <div className="mt-4 rounded-lg border border-[--color-border-subtle] bg-[--color-background] p-3">
        <div className="flex items-center gap-2 text-xs text-[--color-text-subtle]">
          <BookOpen className="h-3.5 w-3.5 flex-shrink-0" />
          <span>Dados salvos localmente</span>
        </div>
      </div>
    </aside>
  )
}
