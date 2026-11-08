import type { PripravaNalogaFormValues } from '../models/pripravaNalogaFormValues'
import type { PripravaNalogaFormErrors } from '../models/pripravaNalogaFormErrors'

const polja: Record<string, keyof PripravaNalogaFormValues> = {
  strojid: 'strojId',
  izvajalecid: 'izvajalecId',
  predvidenizacetek: 'predvideniZacetek',
  predvidenikonec: 'predvideniKonec',
}

export function mapPripravaNalogaApiErrors(
  apiErrors: Record<string, string[]>,
): PripravaNalogaFormErrors {
  const errors: PripravaNalogaFormErrors = {}

  for (const [key, messages] of Object.entries(apiErrors)) {
    const normaliziranKljuc = key.replace(/^\$\./, '').toLowerCase()
    const polje = polja[normaliziranKljuc]
    const sporocilo = messages[0]

    if (polje && sporocilo) {
      errors[polje] = sporocilo
    }
  }

  return errors
}