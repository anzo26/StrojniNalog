import { keycloak } from '../features/auth/keycloak'
import { ApiError } from './ApiError'

const apiUrl = import.meta.env.VITE_API_URL

if (!apiUrl) {
  throw new Error('Manjka nastavitev VITE_API_URL.')
}

const baseUrl = new URL(apiUrl)

export async function apiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const url = new URL(path, baseUrl)

  if (url.origin !== baseUrl.origin) {
    throw new Error('API zahteva mora biti namenjena nastavljenemu backendu.')
  }

  if (!keycloak.authenticated) {
    throw new ApiError(401, 'Za nadaljevanje je potrebna prijava.')
  }

  try {
    await keycloak.updateToken(30)
  } catch {
    keycloak.clearToken()
    throw new ApiError(401, 'Seja je potekla. Ponovno se prijavite.')
  }

  if (!keycloak.token) {
    keycloak.clearToken()
    throw new ApiError(401, 'Dostopni žeton ni na voljo.')
  }

  const headers = new Headers(options.headers)
  headers.set('Authorization', `Bearer ${keycloak.token}`)
  headers.set('Accept', 'application/json')

  const response = await fetch(url, { ...options, headers })

  if (response.status === 401) {
    keycloak.clearToken()
    throw new ApiError(401, 'Prijava ni več veljavna. Ponovno se prijavite.')
  }

  return response
}