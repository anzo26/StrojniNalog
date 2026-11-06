import { Route, Routes } from 'react-router'
import { AuthPanel } from '../features/auth/components/AuthPanel'
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute'
import { NarocilaPage } from '../features/narocila/pages/NarocilaPage'
import { DelovniNalogiPage } from '../features/delovni-nalogi/pages/DelovniNalogiPage'
import { NovoNarociloPage } from '../features/narocila/pages/NovoNarociloPage'
import { NarociloPodrobnostiPage } from '../features/narocila/pages/NarociloPodrobnostiPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AuthPanel />} />
      <Route element={<ProtectedRoute allowedRoles={['narocnik', 'organizator']} />}>
        <Route path="/narocila" element={<NarocilaPage />} />
        <Route path="/narocila/:id" element={<NarociloPodrobnostiPage />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['organizator', 'izvajalec']} />}>
        <Route path="/delovni-nalogi" element={<DelovniNalogiPage />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['narocnik']} />}>
        <Route path="/narocila/novo" element={<NovoNarociloPage />} />
      </Route>
      <Route path="*" element={<h2>Stran ne obstaja</h2>} />
    </Routes>
  )
}