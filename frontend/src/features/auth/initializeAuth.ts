import { keycloak } from './keycloak'

let initialization: Promise<boolean> | undefined

export function initializeAuth(): Promise<boolean> {
  initialization ??= keycloak.init({
    onLoad: 'check-sso',
    pkceMethod: 'S256',
  })
  return initialization
}