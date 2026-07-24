import { createBrowserRouter, RouterProvider } from 'react-router'
import { Shell } from '@/components/layout/Shell'
import { DashboardPage } from '@/pages/DashboardPage'
import { LibraryPage } from '@/pages/LibraryPage'
import { StudyPage } from '@/pages/StudyPage'
import { StatsPage } from '@/pages/StatsPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { AIPromptPage } from '@/pages/AIPromptPage'

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Shell />,
      children: [
        { index: true, element: <DashboardPage /> },
        { path: 'library', element: <LibraryPage /> },
        { path: 'stats', element: <StatsPage /> },
        { path: 'ai-prompt', element: <AIPromptPage /> },
        { path: 'settings', element: <SettingsPage /> },
      ],
    },
    { path: '/study/:deckId', element: <StudyPage /> },
  ],
  { basename: '/memodeck' },
)

export default function App() {
  return <RouterProvider router={router} />
}
