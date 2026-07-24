import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Preferences {
  theme: 'dark' | 'light'
  studyBatchSize: number
  showHints: boolean
}

interface PreferenceStore extends Preferences {
  setTheme: (theme: 'dark' | 'light') => void
  setStudyBatchSize: (size: number) => void
  setShowHints: (show: boolean) => void
}

export const usePreferences = create<PreferenceStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      studyBatchSize: 20,
      showHints: true,
      setTheme: (theme) => set({ theme }),
      setStudyBatchSize: (studyBatchSize) => set({ studyBatchSize }),
      setShowHints: (showHints) => set({ showHints }),
    }),
    { name: 'memodeck-preferences' },
  ),
)
