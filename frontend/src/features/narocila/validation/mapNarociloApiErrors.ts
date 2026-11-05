import type { NarociloFormErrors, NarociloFormValues } from '../models/narociloForm'

const polja: Record<string, keyof NarociloFormValues> = {
  vrstastoritveid: 'vrstaStoritveId',
  opisdela: 'opisDela',
  lokacija: 'lokacija',
  zelenitermin: 'zeleniTermin',
}

export function mapNarociloApiErrors(
  apiErrors: Record<string, string[]>,
): NarociloFormErrors {
  const errors: NarociloFormErrors = {}

  for (const [key, messages] of Object.entries(apiErrors)) {
    const normalizedKey = key.replace(/^\$\./, '').toLowerCase()
    const field = polja[normalizedKey]
    const [message] = messages

    if (field && message) {
      errors[field] = message
    }
  }

  return errors
}