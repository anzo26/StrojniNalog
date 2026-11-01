import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App'
import { initializeAuth } from './features/auth/initializeAuth'
import './styles/globals.css'
import { AuthProvider } from './features/auth/AuthProvider'
import { BrowserRouter } from 'react-router'

const container = document.getElementById('root')

if (!container) {
  throw new Error('Manjka korenski element aplikacije.')
}

const root = createRoot(container)

root.render(<p>Priprava aplikacije …</p>)

initializeAuth()
  .then(() => {
    root.render(
      <StrictMode>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </StrictMode>,
    )
  })
  .catch(() => {
    root.render(
      <main className="app">
        <h1>StrojniNalog</h1>
        <p>Povezava s prijavnim sistemom ni uspela. Poskusite osvežiti stran.</p>
      </main>,
    )
  })