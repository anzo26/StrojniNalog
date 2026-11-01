export type UserRole = 'narocnik' | 'organizator' | 'izvajalec'

export const userRoleLabels: Record<UserRole, string> = {
  narocnik: 'Naročnik',
  organizator: 'Organizator',
  izvajalec: 'Izvajalec',
}

export interface AuthUser {
  authId: string
  username: string
  firstName: string
  lastName: string
  email: string
  roles: UserRole[]
}