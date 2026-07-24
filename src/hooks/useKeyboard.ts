import { useEffect } from 'react'

type KeyMap = Partial<Record<string, (e: KeyboardEvent) => void>>

export function useKeyboard(keyMap: KeyMap, enabled = true) {
  useEffect(() => {
    if (!enabled) return

    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      const key = e.key
      const action = keyMap[key]
      if (action) {
        e.preventDefault()
        action(e)
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [keyMap, enabled])
}
