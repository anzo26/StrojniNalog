import { useCallback, useEffect, useState } from 'react'
import {
  pridobiRazpolozljiveStroje,
  pridobiIzvajalce,
} from '../api/delovniNalogiApi'
import type { Stroj } from '../models/stroj'
import type { Izvajalec } from '../models/izvajalec'

export function useMoznostiPripraveNaloga() {
  const [stroji, setStroji] = useState<Stroj[]>([])
  const [izvajalci, setIzvajalci] = useState<Izvajalec[]>([])
  const [nalaganje, setNalaganje] = useState(true)
  const [napaka, setNapaka] = useState<string | null>(null)
  const [osvezitev, setOsvezitev] = useState(0)

  const osvezi = useCallback(() => {
    setNalaganje(true)
    setNapaka(null)
    setOsvezitev(vrednost => vrednost + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    async function nalozi() {
      try {
        const [nalozeniStroji, nalozeniIzvajalci] = await Promise.all([
          pridobiRazpolozljiveStroje(controller.signal),
          pridobiIzvajalce(controller.signal),
        ])

        if (controller.signal.aborted) return

        setStroji(nalozeniStroji)
        setIzvajalci(nalozeniIzvajalci)
        setNalaganje(false)
      } catch (error: unknown) {
        if (controller.signal.aborted) return

        setNapaka(
          error instanceof Error
            ? error.message
            : 'Možnosti za pripravo naloga ni bilo mogoče naložiti.',
        )
        setNalaganje(false)
        controller.abort()
      }
    }

    void nalozi()

    return () => controller.abort()
  }, [osvezitev])

  return { stroji, izvajalci, nalaganje, napaka, osvezi }
}