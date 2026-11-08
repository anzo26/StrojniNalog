import type { NarociloFormErrors, NarociloFormValues } from '../models/narociloForm'
import { parseLokalniTermin } from '../../../utils/parseLokalniTermin'

export function validirajNarocilo(values: NarociloFormValues): NarociloFormErrors {
  const errors: NarociloFormErrors = {}
  const vrstaStoritveId = Number(values.vrstaStoritveId)

  if (!Number.isSafeInteger(vrstaStoritveId) || vrstaStoritveId <= 0) {
    errors.vrstaStoritveId = 'Izberite vrsto storitve.'
  }

  if (!values.opisDela.trim()) {
    errors.opisDela = 'Vnesite opis dela.'
  }

  if (!values.lokacija.trim()) {
    errors.lokacija = 'Vnesite lokacijo.'
  }

  if (!values.zeleniTermin.trim()) {
    errors.zeleniTermin = 'Vnesite želeni datum in čas.'
  } else if (!parseLokalniTermin(values.zeleniTermin)) {
    errors.zeleniTermin = 'Vnesite veljaven datum in čas.'
  }

  return errors
}