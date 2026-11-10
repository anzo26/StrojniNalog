import { useEffect, useRef, useState } from 'react'
import { ApiError } from '../../../api/ApiError'
import {oddajEvidencoDela,pridobiEvidencoDela,shraniEvidencoDela} from '../api/evidencaDelaApi'
import { StatusDelovnegaNaloga } from '../../../models/enums/StatusDelovnegaNaloga'
import type { DelovniNalogPodrobnosti } from '../models/delovniNalogPodrobnosti'
import type { EvidencaDela } from '../models/evidencaDela'
import {ustvariEvidencoDelaForm,type EvidencaDelaDejanje,type EvidencaDelaFormErrors,type EvidencaDelaFormValues} from '../models/evidencaDelaForm'
import { parseOpravljeneUre } from '../utils/parseOpravljeneUre'
import { mapEvidencaDelaApiErrors } from '../validation/mapEvidencaDelaApiErrors'
import {preveriPotekZaOddajo,validirajEvidencoDela} from '../validation/evidencaDelaValidation'

interface StanjeNalaganja {
  id: number
  poskus: number
  napaka: string | null
}

export function useEvidencaDela(id: number, omogoceno: boolean) {
  const [evidenca, setEvidenca] = useState<EvidencaDela | null>(null)
  const [values, setValues] = useState(ustvariEvidencoDelaForm)
  const [errors, setErrors] = useState<EvidencaDelaFormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [dejanje, setDejanje] = useState<EvidencaDelaDejanje | null>(null)
  const [jeOddano, setJeOddano] = useState(false)
  const [stanjeNalaganja, setStanjeNalaganja] =
    useState<StanjeNalaganja | null>(null)
  const [poskus, setPoskus] = useState(0)

  const obdelava = useRef(false)
  const oddano = useRef(false)

  const trenutnoNalaganje =
    stanjeNalaganja?.id === id && stanjeNalaganja.poskus === poskus
      ? stanjeNalaganja
      : null

  const nalaganje = omogoceno && trenutnoNalaganje === null
  const napakaNalaganja = trenutnoNalaganje?.napaka ?? null

  useEffect(() => {
    if (!omogoceno) return

    const controller = new AbortController()

    async function nalozi() {
      try {
        const podatki = await pridobiEvidencoDela(id, controller.signal)

        if (controller.signal.aborted) return

        setEvidenca(podatki)
        setValues(ustvariEvidencoDelaForm(podatki))
        setStanjeNalaganja({ id, poskus, napaka: null })
      } catch (error) {
        if (controller.signal.aborted) return

        setStanjeNalaganja({
          id,
          poskus,
          napaka: error instanceof ApiError
            ? error.message
            : 'Evidence dela ni bilo mogoče naložiti.',
        })
      }
    }

    void nalozi()

    return () => controller.abort()
  }, [id, omogoceno, poskus])

  function ponoviNalaganje() {
    if (obdelava.current || !napakaNalaganja) return
    setPoskus(previous => previous + 1)
  }

  function setField(field: keyof EvidencaDelaFormValues, value: string) {
    if (obdelava.current || oddano.current) return

    setValues(previous => ({ ...previous, [field]: value }))
    setErrors(previous => {
      const next = { ...previous }
      delete next[field]
      return next
    })
    setSubmitError(null)
  }

  async function izvedi(
    izbranoDejanje: EvidencaDelaDejanje,
    nalog: DelovniNalogPodrobnosti,
  ): Promise<boolean> {
    if (
      !omogoceno || nalaganje || napakaNalaganja || !evidenca ||
      obdelava.current || oddano.current
    ) {
      return false
    }

    const dovoljenoStanje =
      nalog.status === StatusDelovnegaNaloga.VIzvajanju ||
      nalog.status === StatusDelovnegaNaloga.VDopolnitvi

    if (!nalog.jeDodeljenIzvajalec || !dovoljenoStanje) {
      setSubmitError('Evidence tega naloga trenutno ne morete urejati.')
      return false
    }

    const validationErrors = validirajEvidencoDela(values, izbranoDejanje)
    setErrors(validationErrors)
    setSubmitError(null)

    if (Object.keys(validationErrors).length > 0) {
      setSubmitError('Preverite označena polja.')
      return false
    }

    if (izbranoDejanje === 'oddaj') {
      const napakaPoteka = preveriPotekZaOddajo(nalog)

      if (napakaPoteka) {
        setSubmitError(napakaPoteka)
        return false
      }
    }

    const ure = parseOpravljeneUre(values.opravljeneUre)
    const opis = values.opisIzvedbe.trim()

    if (izbranoDejanje === 'oddaj' && ure === null) {
      setErrors({ opravljeneUre: 'Vnesite veljavno število ur.' })
      return false
    }

    obdelava.current = true
    setDejanje(izbranoDejanje)

    try {
      if (izbranoDejanje === 'oddaj' && ure !== null) {
        await oddajEvidencoDela(id, {
          opravljeneUre: ure,
          opisIzvedbe: opis,
        })

        oddano.current = true
        setJeOddano(true)
      } else {
        await shraniEvidencoDela(id, {
          opravljeneUre: ure,
          opisIzvedbe: opis || null,
        })
      }

      setEvidenca(previous => previous ? {
        ...previous,
        opravljeneUre: ure,
        opisIzvedbe: opis || null,
        status: izbranoDejanje === 'oddaj'
          ? StatusDelovnegaNaloga.CakaNaPregled
          : previous.status,
      } : previous)

      return true
    } catch (error) {
      if (error instanceof ApiError) {
        setErrors(mapEvidencaDelaApiErrors(error.errors))
        setSubmitError(error.message)
      } else {
        setSubmitError(
          'Uspeha dejanja ni bilo mogoče potrditi. Preverite povezavo in stanje naloga.',
        )
      }

      return false
    } finally {
      obdelava.current = false
      setDejanje(null)
    }
  }

  return {
    evidenca,
    values,
    errors,
    submitError,
    nalaganje,
    napakaNalaganja,
    dejanje,
    jeOddano,
    setField,
    izvedi,
    ponoviNalaganje,
  }
}