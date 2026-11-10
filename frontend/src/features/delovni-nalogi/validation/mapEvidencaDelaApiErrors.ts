import type { EvidencaDelaFormErrors } from '../models/evidencaDelaForm'

export function mapEvidencaDelaApiErrors(
  errors: Record<string, string[]>,
): EvidencaDelaFormErrors {
  const result: EvidencaDelaFormErrors = {}

  for (const [key, messages] of Object.entries(errors)) {
    const polje = key.replace(/^\$\./, '').toLowerCase()
    const sporocilo = messages[0]

    if (!sporocilo) continue

    if (polje === 'opravljeneure') {
      result.opravljeneUre = sporocilo
    } else if (polje === 'opisizvedbe') {
      result.opisIzvedbe = sporocilo
    }
  }

  return result
}