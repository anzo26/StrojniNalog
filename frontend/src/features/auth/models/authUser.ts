export type UserRole = 'narocnik' | 'organizator' | 'izvajalec'

export interface AuthUser {
  authId: string
  username: string
  firstName: string
  lastName: string
  email: string
  roles: UserRole[]
}