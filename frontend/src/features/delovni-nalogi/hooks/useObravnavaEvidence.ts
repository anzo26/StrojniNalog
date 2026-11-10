import { useRef, useState } from 'react'
import { ApiError } from '../../../api/ApiError'
import {
  potrdiEvidenco,
  vrniEvidenco,
} from '../api/obravnavaEvidenceApi'

type DejanjeObravnave = 'potrdi' | 'vrni'

export function useObravnavaEvidence(id: number) {
  const [razlog, setRazlog] = useState('')
  const [napakaRazloga, setNapakaRazloga] = useState<string | null>(null)
  const [napaka, setNapaka] = useState<string | null>(null)
  const [dejanje, setDejanje] = useState<DejanjeObravnave | null>(null)
  const [zakljuceno, setZakljuceno] = useState(false)

  const stanje = useRef<'idle' | 'pending' | 'success'>('idle')

  function spremeniRazlog(value: string) {
    if (stanje.current !== 'idle') return

    setRazlog(value)
    setNapakaRazloga(null)
    setNapaka(null)
  }

  async function izvedi(
    izbranoDejanje: DejanjeObravnave,
  ): Promise<boolean> {
    if (stanje.current !== 'idle') return false

    setNapaka(null)
    setNapakaRazloga(null)

    const urejenRazlog = razlog.trim()

    if (izbranoDejanje === 'vrni' && !urejenRazlog) {
      setNapakaRazloga('Vnesite razlog dopolnitve.')
      return false
    }

    stanje.current = 'pending'
    setDejanje(izbranoDejanje)

    try {
      if (izbranoDejanje === 'potrdi') {
        await potrdiEvidenco(id)
      } else {
        await vrniEvidenco(id, { razlog: urejenRazlog })
      }

      stanje.current = 'success'
      setZakljuceno(true)
      return true
    } catch (error) {
      stanje.current = 'idle'

      if (error instanceof ApiError) {
        const napakaPolja = Object.entries(error.errors)
          .find(([key]) =>
            key.replace(/^\$\./, '').toLowerCase() === 'razlog',
          )?.[1][0]

        if (izbranoDejanje === 'vrni' && napakaPolja) {
          setNapakaRazloga(napakaPolja)
        }

        setNapaka(error.message)
      } else {
        setNapaka(
          'Uspeha dejanja ni bilo mogoče potrditi. Preverite povezavo in stanje naloga.',
        )
      }

      return false
    } finally {
      setDejanje(null)
    }
  }

  return {
    razlog,
    napakaRazloga,
    napaka,
    dejanje,
    zakljuceno,
    spremeniRazlog,
    potrdi: () => izvedi('potrdi'),
    vrni: () => izvedi('vrni'),
  }
}