import type { UserRole } from './authUser'

export interface UporabnikProfil {
  id: number
  ime: string
  priimek: string
  email: string
  vloge: UserRole[]
}