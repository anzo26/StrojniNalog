import { useRef, useState } from 'react'
import { ApiError } from '../../../api/ApiError'
import { potrdiNarocilo, zavrniNarocilo } from '../api/narocilaApi'

type OperacijaObravnave = 'potrditev' | 'zavrnitev'

export function useObravnavaNarocila(id: number) {
  const [obdelava, setObdelava] = useState<OperacijaObravnave | null>(null)
  const [napaka, setNapaka] = useState<string | null>(null)
  const [napakaRazloga, setNapakaRazloga] = useState<string | null>(null)
  const [zastarelo, setZastarelo] = useState(false)
  const zasedeno = useRef(false)

  async function izvedi(
    operacija: OperacijaObravnave,
    zahtevek: () => Promise<void>,
  ): Promise<boolean> {
    if (zasedeno.current || zastarelo) return false

    zasedeno.current = true
    setObdelava(operacija)
    setNapaka(null)
    setNapakaRazloga(null)

    try {
      await zahtevek()
      return true
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        setNapaka(error.message)
        setNapakaRazloga(
          error.errors.Razlog?.[0] ?? error.errors.razlog?.[0] ?? null,
        )

        if (error.status === 409) {
          setZastarelo(true)
        }
      } else {
        setNapaka(
          error instanceof Error
            ? error.message
            : 'Naročila ni bilo mogoče obravnavati.',
        )
      }

      return false
    } finally {
      zasedeno.current = false
      setObdelava(null)
    }
  }

  function potrdi(): Promise<boolean> {
    return izvedi('potrditev', () => potrdiNarocilo(id))
  }

  async function zavrni(razlog: string): Promise<boolean> {
    if (zasedeno.current || zastarelo) return false

    const urejenRazlog = razlog.trim()

    if (!urejenRazlog) {
      setNapaka(null)
      setNapakaRazloga('Vnesite razlog zavrnitve.')
      return false
    }

    return izvedi('zavrnitev', () =>
      zavrniNarocilo(id, { razlog: urejenRazlog }),
    )
  }

  function pocistiNapakoRazloga() {
    setNapakaRazloga(null)
  }

  return {
    obdelava,
    napaka,
    napakaRazloga,
    zastarelo,
    potrdi,
    zavrni,
    pocistiNapakoRazloga,
  }
}