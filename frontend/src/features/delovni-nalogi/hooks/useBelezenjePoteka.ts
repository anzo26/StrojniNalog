import { useRef, useState } from 'react'
import { ApiError } from '../../../api/ApiError'
import { zabeleziZacetekDela, zabeleziKonecDela } from '../api/delovniNalogiApi'

type OperacijaPoteka = 'zacetek' | 'konec'

export function useBelezenjePoteka(nalogId: number) {
  const [obdelava, setObdelava] = useState<OperacijaPoteka | null>(null)
  const [napaka, setNapaka] = useState<string | null>(null)
  const [potrebujeOsvezitev, setPotrebujeOsvezitev] = useState(false)
  const stanje = useRef<'idle' | 'pending' | 'success' | 'stale'>('idle')

  async function izvedi(operacija: OperacijaPoteka): Promise<boolean> {
    if (stanje.current !== 'idle') return false

    stanje.current = 'pending'
    setObdelava(operacija)
    setNapaka(null)

    try {
      if (operacija === 'zacetek') {
        await zabeleziZacetekDela(nalogId)
      } else {
        await zabeleziKonecDela(nalogId)
      }

      stanje.current = 'success'
      return true
    } catch (error: unknown) {
      stanje.current = 'stale'
      setPotrebujeOsvezitev(true)
      setNapaka(
        error instanceof ApiError
          ? error.message
          : 'Dejanja ni bilo mogoče potrditi. Osvežite podatke in preverite potek dela.',
      )

      return false
    } finally {
      setObdelava(null)
    }
  }

  function zacni() {
    return izvedi('zacetek')
  }

  function koncaj() {
    return izvedi('konec')
  }

  return { obdelava, napaka, potrebujeOsvezitev, zacni, koncaj }
}