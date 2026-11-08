import { apiFetch } from '../../../api/apiClient'
import { readApiError } from '../../../api/readApiError'
import type { Stroj } from '../models/stroj'
import type { Izvajalec } from '../models/izvajalec'
import type { PripraviDelovniNalogRequest } from '../models/pripraviDelovniNalogRequest'
import type { PripravljenDelovniNalog } from '../models/pripravljenDelovniNalog'
import type { DelovniNalogPodrobnosti } from '../models/delovniNalogPodrobnosti'

export async function pridobiRazpolozljiveStroje(signal?: AbortSignal): Promise<Stroj[]> {
  const response = await apiFetch('/api/stroji/razpolozljivi', { signal })

  if (!response.ok) {
    throw await readApiError(response, 'Strojev ni bilo mogoče naložiti.')
  }

  return response.json()
}

export async function pridobiIzvajalce(signal?: AbortSignal): Promise<Izvajalec[]> {
  const response = await apiFetch('/api/izvajalci', { signal })

  if (!response.ok) {
    throw await readApiError(response, 'Izvajalcev ni bilo mogoče naložiti.')
  }

  return response.json()
}

export async function pripraviDelovniNalog(
  podatki: PripraviDelovniNalogRequest,
  signal?: AbortSignal,
): Promise<PripravljenDelovniNalog> {
  const response = await apiFetch('/api/delovni-nalogi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(podatki),
    signal,
  })

  if (!response.ok) {
    throw await readApiError(response, 'Delovnega naloga ni bilo mogoče pripraviti.')
  }

  return response.json()
}

export async function pridobiDelovniNalog(
  id: number,
  signal?: AbortSignal,
): Promise<DelovniNalogPodrobnosti> {
  const response = await apiFetch(`/api/delovni-nalogi/${id}`, { signal })

  if (!response.ok) {
    throw await readApiError(response, 'Delovnega naloga ni bilo mogoče naložiti.')
  }

  return response.json()
}