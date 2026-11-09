import { useCallback, useEffect, useState } from 'react'
import { pridobiDelovneNaloge } from '../api/delovniNalogiApi'
import type { DelovniNalogSeznam } from '../models/delovniNalogSeznam'

export function useDelovniNalogi() {
  const [nalogi, setNalogi] = useState<DelovniNalogSeznam[]>([])
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
        const podatki = await pridobiDelovneNaloge(controller.signal)

        if (controller.signal.aborted) return

        setNalogi(podatki)
      } catch (error: unknown) {
        if (controller.signal.aborted) return

        setNapaka(
          error instanceof Error
            ? error.message
            : 'Delovnih nalogov ni bilo mogoče naložiti.',
        )
      } finally {
        if (!controller.signal.aborted) setNalaganje(false)
      }
    }

    void nalozi()

    return () => controller.abort()
  }, [osvezitev])

  return { nalogi, nalaganje, napaka, osvezi }
}