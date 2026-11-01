import { AppNavigation } from '../components/layout/AppNavigation'
import { AppRoutes } from './AppRoutes'

function App() {
  return (
    <main className="app">
      <h1>StrojniNalog</h1>
      <AppNavigation />
      <AppRoutes />
    </main>
  )
}

export default App