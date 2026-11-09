import { Route, Routes } from 'react-router'
import { AuthPanel } from '../features/auth/components/AuthPanel'
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute'
import { NarocilaPage } from '../features/narocila/pages/NarocilaPage'
import { DelovniNalogiPage } from '../features/delovni-nalogi/pages/DelovniNalogiPage'
import { NovoNarociloPage } from '../features/narocila/pages/NovoNarociloPage'
import { NarociloPodrobnostiPage } from '../features/narocila/pages/NarociloPodrobnostiPage'
import { PripravaNalogaPage } from '../features/delovni-nalogi/pages/PripravaNalogaPage'
import { DelovniNalogPodrobnostiPage } from '../features/delovni-nalogi/pages/DelovniNalogPodrobnostiPage'

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
      <Route element={<ProtectedRoute allowedRoles={['organizator']} />}>
        <Route path="/narocila/:id/delovni-nalog/novo" element={<PripravaNalogaPage />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['organizator', 'izvajalec', 'narocnik']} />}>
        <Route path="/delovni-nalogi/:id" element={<DelovniNalogPodrobnostiPage />} />
      </Route>
      <Route path="*" element={<h2>Stran ne obstaja</h2>} />
    </Routes>
  )
}