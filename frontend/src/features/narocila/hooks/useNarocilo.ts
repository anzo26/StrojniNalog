import { useCallback, useEffect, useState } from 'react'
import { pridobiNarocilo } from '../api/narocilaApi'
import type { NarociloPodrobnosti } from '../models/narociloPodrobnosti'

interface StanjeNarocila {
  id: number
  osvezitev: number
  narocilo: NarociloPodrobnosti | null
  napaka: string | null
}

export function useNarocilo(id: number) {
  const [stanje, setStanje] = useState<StanjeNarocila | null>(null)
  const [osvezitev, setOsvezitev] = useState(0)

  const osvezi = useCallback(() => {
    setOsvezitev((vrednost) => vrednost + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    async function nalozi() {
      try {
        const narocilo = await pridobiNarocilo(id, controller.signal)

        if (controller.signal.aborted) return

        setStanje({ id, osvezitev, narocilo, napaka: null })
      } catch (error: unknown) {
        if (controller.signal.aborted) return

        setStanje({
          id,
          osvezitev,
          narocilo: null,
          napaka: error instanceof Error
            ? error.message
            : 'Podrobnosti naročila ni bilo mogoče naložiti.',
        })
      }
    }

    void nalozi()

    return () => controller.abort()
  }, [id, osvezitev])

  const trenutno = stanje?.id === id && stanje.osvezitev === osvezitev
    ? stanje
    : null

  return {
    narocilo: trenutno?.narocilo ?? null,
    nalaganje: trenutno === null,
    napaka: trenutno?.napaka ?? null,
    osvezi,
  }
}