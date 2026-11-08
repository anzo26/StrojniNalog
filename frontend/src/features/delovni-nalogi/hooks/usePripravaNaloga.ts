import { useRef, useState } from 'react'
import { ApiError } from '../../../api/ApiError'
import { parseLokalniTermin } from '../../../utils/parseLokalniTermin'
import { pripraviDelovniNalog } from '../api/delovniNalogiApi'
import { ustvariPraznoPripravoNaloga } from '../models/pripravaNalogaFormValues'
import type { PripravaNalogaFormValues } from '../models/pripravaNalogaFormValues'
import type { PripravaNalogaFormErrors } from '../models/pripravaNalogaFormErrors'
import type { PripravljenDelovniNalog } from '../models/pripravljenDelovniNalog'
import { validirajPripravoNaloga } from '../validation/pripravaNalogaValidation'
import { mapPripravaNalogaApiErrors } from '../validation/mapPripravaNalogaApiErrors'

export function usePripravaNaloga(narociloId: number) {
  const [values, setValues] = useState(ustvariPraznoPripravoNaloga)
  const [errors, setErrors] = useState<PripravaNalogaFormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<PripravljenDelovniNalog | null>(null)
  const submissionState = useRef<'idle' | 'pending' | 'success'>('idle')

  function setField(field: keyof PripravaNalogaFormValues, value: string) {
    if (submissionState.current !== 'idle') return

    setValues(previous => ({ ...previous, [field]: value }))
    setErrors(previous => {
      const next = { ...previous }
      delete next[field]
      return next
    })
    setSubmitError(null)
  }

  async function submit() {
    if (submissionState.current !== 'idle') return

    setSubmitError(null)

    if (!Number.isSafeInteger(narociloId) || narociloId <= 0) {
      setSubmitError('Naročilo ni veljavno.')
      return
    }

    const validationErrors = validirajPripravoNaloga(values)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      setSubmitError('Preverite označena polja.')
      return
    }

    const zacetek = parseLokalniTermin(values.predvideniZacetek)
    const konec = parseLokalniTermin(values.predvideniKonec)

    if (!zacetek || !konec) {
      setSubmitError('Preverite predvideni začetek in konec.')
      return
    }

    submissionState.current = 'pending'
    setIsSubmitting(true)

    try {
      const odgovor = await pripraviDelovniNalog({
        narociloId,
        strojId: Number(values.strojId),
        izvajalecId: Number(values.izvajalecId),
        predvideniZacetek: zacetek.toISOString(),
        predvideniKonec: konec.toISOString(),
      })

      submissionState.current = 'success'
      setResult(odgovor)
    } catch (error: unknown) {
      submissionState.current = 'idle'

      if (error instanceof ApiError) {
        if (error.status === 400) {
          const apiErrors = mapPripravaNalogaApiErrors(error.errors)
          setErrors(apiErrors)
          setSubmitError(
            Object.keys(apiErrors).length > 0
              ? 'Preverite označena polja.'
              : error.message,
          )
        } else if (error.status === 403) {
          setSubmitError('Za pripravo delovnega naloga nimate dovoljenja.')
        } else if (error.status === 409) {
          setSubmitError(
            `${error.message} Vrnite se na naročilo in preverite njegovo stanje.`,
          )
        } else {
          setSubmitError(error.message)
        }
      } else {
        setSubmitError(
          'Priprave ni bilo mogoče potrditi. Pri naročilu preverite, ali je nalog nastal.',
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    values,
    errors,
    submitError,
    isSubmitting,
    result,
    setField,
    submit,
  }
}