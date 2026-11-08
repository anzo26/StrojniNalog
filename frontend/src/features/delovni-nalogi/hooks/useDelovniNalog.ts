import { useCallback, useEffect, useState } from 'react'
import { pridobiDelovniNalog } from '../api/delovniNalogiApi'
import type { DelovniNalogPodrobnosti } from '../models/delovniNalogPodrobnosti'

interface StanjeNaloga {
  id: number
  osvezitev: number
  nalog: DelovniNalogPodrobnosti | null
  napaka: string | null
}

export function useDelovniNalog(id: number) {
  const [stanje, setStanje] = useState<StanjeNaloga | null>(null)
  const [osvezitev, setOsvezitev] = useState(0)

  const osvezi = useCallback(() => {
    setOsvezitev(vrednost => vrednost + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    async function nalozi() {
      try {
        const nalog = await pridobiDelovniNalog(id, controller.signal)

        if (controller.signal.aborted) return

        setStanje({ id, osvezitev, nalog, napaka: null })
      } catch (error: unknown) {
        if (controller.signal.aborted) return

        setStanje({
          id,
          osvezitev,
          nalog: null,
          napaka: error instanceof Error
            ? error.message
            : 'Delovnega naloga ni bilo mogoče naložiti.',
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
    nalog: trenutno?.nalog ?? null,
    napaka: trenutno?.napaka ?? null,
    nalaganje: trenutno === null,
    osvezi,
  }
}