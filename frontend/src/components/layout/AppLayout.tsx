import type { ReactNode } from 'react'
import { AppHeader } from './AppHeader'
import { AppNavigation } from './AppNavigation'
import './AppLayout.css'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="app-layout">
      <a className="skip-link" href="#main-content">Preskoči na vsebino</a>
      <AppHeader />
      <div className="app-shell">
        <aside className="app-sidebar">
          <p className="app-sidebar-label">Delovni prostor</p>
          <AppNavigation />
        </aside>
        <main id="main-content" className="app-content" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  )
}