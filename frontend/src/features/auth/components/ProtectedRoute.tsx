import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../../../hooks/useAuth'
import type { UserRole } from '../models/authUser'

interface ProtectedRouteProps {
  allowedRoles?: UserRole[]
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (allowedRoles && !allowedRoles.some(role => user.roles.includes(role))) {
    return (
      <section role="alert">
        <h2>Dostop ni dovoljen</h2>
        <p>Za ogled te strani nimate ustrezne uporabniške vloge.</p>
      </section>
    )
  }

  return <Outlet />
}