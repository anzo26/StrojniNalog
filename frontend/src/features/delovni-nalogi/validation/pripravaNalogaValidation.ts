import { parseLokalniTermin } from '../../../utils/parseLokalniTermin'
import type { PripravaNalogaFormValues } from '../models/pripravaNalogaFormValues'
import type { PripravaNalogaFormErrors } from '../models/pripravaNalogaFormErrors'

function jeVeljavenId(value: string): boolean {
  const id = Number(value)
  return Number.isSafeInteger(id) && id > 0
}

export function validirajPripravoNaloga(
  values: PripravaNalogaFormValues,
): PripravaNalogaFormErrors {
  const errors: PripravaNalogaFormErrors = {}

  if (!jeVeljavenId(values.strojId)) {
    errors.strojId = 'Izberite stroj.'
  }

  if (!jeVeljavenId(values.izvajalecId)) {
    errors.izvajalecId = 'Izberite izvajalca.'
  }

  const zacetek = parseLokalniTermin(values.predvideniZacetek)
  const konec = parseLokalniTermin(values.predvideniKonec)

  if (!values.predvideniZacetek.trim()) {
    errors.predvideniZacetek = 'Vnesite predvideni začetek.'
  } else if (!zacetek) {
    errors.predvideniZacetek = 'Vnesite veljaven datum in čas.'
  }

  if (!values.predvideniKonec.trim()) {
    errors.predvideniKonec = 'Vnesite predvideni konec.'
  } else if (!konec) {
    errors.predvideniKonec = 'Vnesite veljaven datum in čas.'
  }

  if (zacetek && konec && konec.getTime() <= zacetek.getTime()) {
    errors.predvideniKonec = 'Predvideni konec mora biti po začetku.'
  }

  return errors
}