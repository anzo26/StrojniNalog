import { createContext } from 'react'
import type { AuthUser } from './models/authUser'

interface AuthContextValue {
  user: AuthUser | null
  login: () => Promise<void>
  register: () => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)