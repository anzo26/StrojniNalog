import { apiFetch } from '../../../api/apiClient'
import { readApiError } from '../../../api/readApiError'
import type { EvidencaDela } from '../models/evidencaDela'
import type { ShraniEvidencoRequest } from '../models/shraniEvidencoRequest'
import type { OddajEvidencoRequest } from '../models/oddajEvidencoRequest'

export async function pridobiEvidencoDela(nalogId: number,signal?: AbortSignal): Promise<EvidencaDela> {
  const response = await apiFetch(`/api/delovni-nalogi/${nalogId}/evidenca`, {
    signal,
  })

  if (!response.ok) {
    throw await readApiError(response, 'Evidence dela ni bilo mogoče naložiti.')
  }

  return response.json()
}

export async function shraniEvidencoDela(nalogId: number,podatki: ShraniEvidencoRequest,signal?: AbortSignal): Promise<void> {
  const response = await apiFetch(`/api/delovni-nalogi/${nalogId}/evidenca`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(podatki),
    signal,
  })

  if (!response.ok) {
    throw await readApiError(response, 'Evidence dela ni bilo mogoče shraniti.')
  }
}

export async function oddajEvidencoDela(nalogId: number,podatki: OddajEvidencoRequest,signal?: AbortSignal): Promise<void> {
  const response = await apiFetch(`/api/delovni-nalogi/${nalogId}/evidenca/oddaja`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(podatki),
    signal,
  })

  if (!response.ok) {
    throw await readApiError(response, 'Evidence dela ni bilo mogoče oddati v pregled.')
  }
}