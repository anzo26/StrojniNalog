import { apiFetch } from '../../../api/apiClient'
import { readApiError } from '../../../api/readApiError'
import type { VrstaStoritve } from '../models/vrstaStoritve'
import type { UstvariNarociloRequest } from '../models/ustvariNarociloRequest'
import type { OddanoNarocilo } from '../models/oddanoNarocilo'

export async function pridobiAktivneStoritve(signal?: AbortSignal,): Promise<VrstaStoritve[]> {
  const response = await apiFetch('/api/vrste-storitev/aktivne', { signal })
  if (!response.ok) {
    throw await readApiError(response, 'Storitev ni bilo mogoče naložiti.')
  }

  return response.json()
}

export async function oddajNarocilo(podatki: UstvariNarociloRequest, signal?: AbortSignal,): Promise<OddanoNarocilo> {
  const response = await apiFetch('/api/narocila', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(podatki),
    signal,
  })

  if (!response.ok) {
    throw await readApiError(response, 'Naročila ni bilo mogoče oddati.')
  }

  return response.json()
}