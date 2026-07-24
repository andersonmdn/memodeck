import { Outlet } from 'react-router'
import { Sidebar } from './Sidebar'

export function Shell() {
  return (
    <div className="flex h-screen overflow-hidden bg-[--color-background]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
