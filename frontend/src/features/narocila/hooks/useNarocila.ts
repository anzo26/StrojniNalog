import { useCallback, useEffect, useState } from 'react'
import { pridobiNarocila } from '../api/narocilaApi'
import type { NarociloSeznam } from '../models/narociloSeznam'

export function useNarocila() {
  const [narocila, setNarocila] = useState<NarociloSeznam[]>([])
  const [nalaganje, setNalaganje] = useState(true)
  const [napaka, setNapaka] = useState<string | null>(null)
  const [osvezitev, setOsvezitev] = useState(0)

  const osvezi = useCallback(() => {
    setNalaganje(true)
    setNapaka(null)
    setOsvezitev((vrednost) => vrednost + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    async function nalozi() {
      try {
        const podatki = await pridobiNarocila(controller.signal)

        if (controller.signal.aborted) return

        setNarocila(podatki)
      } catch (error: unknown) {
        if (controller.signal.aborted) return

        setNapaka(
          error instanceof Error
            ? error.message
            : 'Naročil ni bilo mogoče naložiti.',
        )
      } finally {
        if (!controller.signal.aborted) {
          setNalaganje(false)
        }
      }
    }

    void nalozi()

    return () => controller.abort()
  }, [osvezitev])

  return { narocila, nalaganje, napaka, osvezi }
}