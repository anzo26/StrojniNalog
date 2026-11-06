import { apiFetch } from '../../../api/apiClient'
import { readApiError } from '../../../api/readApiError'
import type { VrstaStoritve } from '../models/vrstaStoritve'
import type { UstvariNarociloRequest } from '../models/ustvariNarociloRequest'
import type { OddanoNarocilo } from '../models/oddanoNarocilo'
import type { NarociloSeznam } from '../models/narociloSeznam'
import type { NarociloPodrobnosti } from '../models/narociloPodrobnosti'
import type { ZavrniNarociloRequest } from '../models/zavrniNarociloRequest'

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

export async function pridobiNarocila(signal?: AbortSignal): Promise<NarociloSeznam[]> {
  const response = await apiFetch('/api/narocila', { signal })

  if (!response.ok) {
    throw await readApiError(response, 'Naročil ni bilo mogoče naložiti.')
  }

  return response.json()
}

export async function pridobiNarocilo(id: number, signal?: AbortSignal): Promise<NarociloPodrobnosti> {
  const response = await apiFetch(`/api/narocila/${id}`, { signal })

  if (!response.ok) {
    throw await readApiError(response, 'Podrobnosti naročila ni bilo mogoče naložiti.')
  }

  return response.json()
}

export async function potrdiNarocilo(id: number, signal?: AbortSignal): Promise<void> {
  const response = await apiFetch(`/api/narocila/${id}/potrditev`, {
    method: 'POST',
    signal,
  })

  if (!response.ok) {
    throw await readApiError(response, 'Naročila ni bilo mogoče potrditi.')
  }
}

export async function zavrniNarocilo(
  id: number,
  podatki: ZavrniNarociloRequest,
  signal?: AbortSignal,
): Promise<void> {
  const response = await apiFetch(`/api/narocila/${id}/zavrnitev`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(podatki),
    signal,
  })

  if (!response.ok) {
    throw await readApiError(response, 'Naročila ni bilo mogoče zavrniti.')
  }
}