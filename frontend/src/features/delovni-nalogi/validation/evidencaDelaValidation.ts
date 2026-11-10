import type { DelovniNalogPodrobnosti } from '../models/delovniNalogPodrobnosti'
import type {EvidencaDelaDejanje,EvidencaDelaFormErrors,EvidencaDelaFormValues} from '../models/evidencaDelaForm'
import { parseOpravljeneUre } from '../utils/parseOpravljeneUre'

export function validirajEvidencoDela(
  values: EvidencaDelaFormValues,
  dejanje: EvidencaDelaDejanje,
): EvidencaDelaFormErrors {
  const errors: EvidencaDelaFormErrors = {}
  const vnosUr = values.opravljeneUre.trim()

  if (!vnosUr) {
    if (dejanje === 'oddaj') {
      errors.opravljeneUre = 'Vnesite opravljene ure.'
    }
  } else {
    const ure = parseOpravljeneUre(vnosUr)

    if (ure === null) {
      errors.opravljeneUre = 'Vnesite veljavno število ur.'
    } else if (ure <= 0 || ure > 1000) {
      errors.opravljeneUre =
        'Opravljene ure morajo biti večje od 0 in največ 1000.'
    }
  }

  if (dejanje === 'oddaj' && !values.opisIzvedbe.trim()) {
    errors.opisIzvedbe = 'Vnesite opis izvedbe.'
  }

  return errors
}

export function preveriPotekZaOddajo(
  nalog: Pick<
    DelovniNalogPodrobnosti,
    'dejanskiZacetek' | 'dejanskiKonec'
  >,
): string | null {
  if (!nalog.dejanskiZacetek || !nalog.dejanskiKonec) {
    return 'Pred oddajo evidence zabeležite začetek in konec dela.'
  }

  const zacetek = Date.parse(nalog.dejanskiZacetek)
  const konec = Date.parse(nalog.dejanskiKonec)

  if (!Number.isFinite(zacetek) || !Number.isFinite(konec)) {
    return 'Dejanska časa nista veljavna. Osvežite podatke naloga.'
  }

  if (konec < zacetek) {
    return 'Dejanski konec ne sme biti pred dejanskim začetkom.'
  }

  return null
}