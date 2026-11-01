import { keycloak } from './keycloak'
import type { AuthUser, UserRole } from './models/authUser'

function isUserRole(role: string): role is UserRole {
  return role === 'narocnik' || role === 'organizator' || role === 'izvajalec'
}

export function getCurrentUser(): AuthUser | null {
  const token = keycloak.tokenParsed

  if (!keycloak.authenticated || !token?.sub) {
    return null
  }

  return {
    authId: token.sub,
    username: token.preferred_username ?? '',
    firstName: token.given_name ?? '',
    lastName: token.family_name ?? '',
    email: token.email ?? '',
    roles: (token.realm_access?.roles ?? []).filter(isUserRole),
  }
}

export function login(): Promise<void> {
  return keycloak.login({
    redirectUri: window.location.origin,
  })
}

export function register(): Promise<void> {
  return keycloak.register({
    redirectUri: window.location.origin,
  })
}

export function logout(): Promise<void> {
  return keycloak.logout({
    redirectUri: window.location.origin,
  })
}