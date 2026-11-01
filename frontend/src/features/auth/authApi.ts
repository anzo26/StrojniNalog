import { apiFetch } from '../../api/apiClient'
import { ApiError } from '../../api/ApiError'
import type { UporabnikProfil } from './models/uporabnikProfil'

export async function getMyProfile(signal?: AbortSignal): Promise<UporabnikProfil> {
  const response = await apiFetch('/api/uporabniki/me', { signal })
  console.log(response)

  if (!response.ok) {
    throw new ApiError(response.status, 'Profila ni bilo mogoče pridobiti.')
  }

  return response.json()
}