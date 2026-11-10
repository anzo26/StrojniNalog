import { apiFetch } from '../../../api/apiClient'
import { readApiError } from '../../../api/readApiError'
import type { VrniEvidencoRequest } from '../models/vrniEvidencoRequest'

export async function potrdiEvidenco(
  id: number,
  signal?: AbortSignal,
): Promise<void> {
  const response = await apiFetch(
    `/api/delovni-nalogi/${id}/evidenca/potrditev`,
    {
      method: 'POST',
      signal,
    },
  )

  if (!response.ok) {
    throw await readApiError(response, 'Evidence ni bilo mogoče potrditi.')
  }
}

export async function vrniEvidenco(
  id: number,
  podatki: VrniEvidencoRequest,
  signal?: AbortSignal,
): Promise<void> {
  const response = await apiFetch(
    `/api/delovni-nalogi/${id}/evidenca/vrnitev`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(podatki),
      signal,
    },
  )

  if (!response.ok) {
    throw await readApiError(
      response,
      'Evidence ni bilo mogoče vrniti v dopolnitev.',
    )
  }
}