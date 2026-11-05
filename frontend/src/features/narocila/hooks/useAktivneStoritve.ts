import { useEffect, useState } from 'react'
import { pridobiAktivneStoritve } from '../api/narocilaApi'
import type { VrstaStoritve } from '../models/vrstaStoritve'

interface StoritveState {
  storitve: VrstaStoritve[]
  loading: boolean
  error: string | null
}

export function useAktivneStoritve() {
  const [state, setState] = useState<StoritveState>({
    storitve: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    const controller = new AbortController()

    pridobiAktivneStoritve(controller.signal)
      .then(storitve => {
        if (!controller.signal.aborted) {
          setState({ storitve, loading: false, error: null })
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setState({
            storitve: [],
            loading: false,
            error: 'Storitev ni bilo mogoče naložiti. Poskusite osvežiti stran.',
          })
        }
      })

    return () => controller.abort()
  }, [])

  return state
}