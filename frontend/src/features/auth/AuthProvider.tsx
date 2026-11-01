import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { AuthContext } from './AuthContext'
import { getCurrentUser, login, register, logout } from './authService'
import { keycloak } from './keycloak'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState(getCurrentUser)

  useEffect(() => {
    const syncUser = () => setUser(getCurrentUser())

    keycloak.onAuthSuccess = syncUser
    keycloak.onAuthRefreshSuccess = syncUser
    keycloak.onAuthLogout = syncUser
    keycloak.onAuthRefreshError = () => keycloak.clearToken()
    keycloak.onTokenExpired = () => {
      void keycloak.updateToken(30).catch(() => keycloak.clearToken())
    }

    return () => {
      keycloak.onAuthSuccess = undefined
      keycloak.onAuthRefreshSuccess = undefined
      keycloak.onAuthLogout = undefined
      keycloak.onAuthRefreshError = undefined
      keycloak.onTokenExpired = undefined
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}