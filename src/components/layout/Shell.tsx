import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router'
import { Sidebar } from './Sidebar'

export function Shell() {
  const mainRef = useRef<HTMLElement>(null)
  const { pathname } = useLocation()

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-background)]">
      <Sidebar />
      <main ref={mainRef} className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
