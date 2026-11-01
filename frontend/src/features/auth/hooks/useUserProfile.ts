import { useEffect, useState } from 'react'
import { getMyProfile } from '../authApi'
import type { UporabnikProfil } from '../models/uporabnikProfil'

interface ProfileState {
  profile: UporabnikProfil | null
  loading: boolean
  error: string | null
}

export function useUserProfile() {
  const [state, setState] = useState<ProfileState>({
    profile: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    const controller = new AbortController()

    getMyProfile(controller.signal)
      .then(profile => {
        if (!controller.signal.aborted) {
          setState({ profile, loading: false, error: null })
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setState({
            profile: null,
            loading: false,
            error: 'Profila ni bilo mogoče naložiti. Poskusite osvežiti stran.',
          })
        }
      })

    return () => controller.abort()
  }, [])

  return state
}