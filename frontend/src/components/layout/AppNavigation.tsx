import { NavLink } from 'react-router'
import { useAuth } from '../../hooks/useAuth'

export function AppNavigation() {
  const { user } = useAuth()
  const canViewOrders = user?.roles.some(
    role => role === 'narocnik' || role === 'organizator',
  )
  const canViewWorkOrders = user?.roles.some(
    role => role === 'organizator' || role === 'izvajalec',
  )

  return (
    <nav className="app-navigation" aria-label="Glavna navigacija">
      <NavLink to="/" end>Račun</NavLink>
      {canViewOrders && <NavLink to="/narocila">Naročila</NavLink>}
      {canViewWorkOrders && <NavLink to="/delovni-nalogi">Delovni nalogi</NavLink>}
    </nav>
  )
}