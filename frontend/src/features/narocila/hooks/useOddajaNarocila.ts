import { useRef, useState } from 'react'
import { ApiError } from '../../../api/ApiError'
import { oddajNarocilo } from '../api/narocilaApi'
import { ustvariPraznoNarocilo } from '../models/narociloForm'
import type { NarociloFormErrors, NarociloFormValues } from '../models/narociloForm'
import type { OddanoNarocilo } from '../models/oddanoNarocilo'
import { parseLokalniTermin } from '../../../utils/parseLokalniTermin'
import { mapNarociloApiErrors } from '../validation/mapNarociloApiErrors'
import { validirajNarocilo } from '../validation/narociloValidation'

export function useOddajaNarocila() {
  const [values, setValues] = useState(ustvariPraznoNarocilo)
  const [errors, setErrors] = useState<NarociloFormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<OddanoNarocilo | null>(null)
  const submissionState = useRef<'idle' | 'pending' | 'success'>('idle')

  function setField(field: keyof NarociloFormValues, value: string) {
    if (submissionState.current !== 'idle') {
      return
    }

    setValues(previous => ({ ...previous, [field]: value }))
    setErrors(previous => {
      const next = { ...previous }
      delete next[field]
      return next
    })
    setSubmitError(null)
  }

  async function submit() {
    if (submissionState.current !== 'idle') {
      return
    }

    const validationErrors = validirajNarocilo(values)
    setErrors(validationErrors)
    setSubmitError(null)

    if (Object.keys(validationErrors).length > 0) {
      setSubmitError('Preverite označena polja.')
      return
    }

    const termin = parseLokalniTermin(values.zeleniTermin)
    if (!termin) {
      setErrors({ zeleniTermin: 'Vnesite veljaven datum in čas.' })
      return
    }

    submissionState.current = 'pending'
    setIsSubmitting(true)

    try {
      const odgovor = await oddajNarocilo({
        vrstaStoritveId: Number(values.vrstaStoritveId),
        opisDela: values.opisDela.trim(),
        lokacija: values.lokacija.trim(),
        zeleniTermin: termin.toISOString(),
      })

      submissionState.current = 'success'
      setResult(odgovor)
    } catch (error) {
      submissionState.current = 'idle'

      if (error instanceof ApiError) {
        if (error.status === 400) {
          setErrors(mapNarociloApiErrors(error.errors))
          setSubmitError('Naročilo ni bilo oddano. Preverite vnesene podatke.')
        } else if (error.status === 403) {
          setSubmitError('Za oddajo naročila nimate dovoljenja.')
        } else {
          setSubmitError(error.message)
        }
      } else {
        setSubmitError('Oddaje ni bilo mogoče potrditi. Preverite povezavo.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  function reset() {
    if (submissionState.current === 'pending') {
      return
    }

    submissionState.current = 'idle'
    setValues(ustvariPraznoNarocilo())
    setErrors({})
    setSubmitError(null)
    setResult(null)
  }

  return {
    values,
    errors,
    submitError,
    isSubmitting,
    result,
    setField,
    submit,
    reset,
  }
}