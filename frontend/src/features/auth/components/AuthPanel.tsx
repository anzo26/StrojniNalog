import { useState } from 'react'
import { useAuth } from '../../../hooks/useAuth'

export function AuthPanel() {
  const { user, login, register, logout } = useAuth()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleAction(action: () => Promise<void>) {
    setPending(true)
    setError(null)

    try {
      await action()
    } catch {
      setError('Dejanje ni uspelo. Poskusite znova.')
    } finally {
      setPending(false)
    }
  }

  return (
    <section aria-label="Uporabniški račun">
      {user ? (
        <>
          <p>Prijavljen uporabnik: <strong>{user.username}</strong></p>
          <p>Vloga: {user.roles.join(', ') || 'Brez poslovne vloge'}</p>
          <button
            type="button"
            disabled={pending}
            onClick={() => void handleAction(logout)}
          >
            Odjava
          </button>
        </>
      ) : (
        <div className="auth-actions">
          <button
            type="button"
            disabled={pending}
            onClick={() => void handleAction(login)}
          >
            Prijava
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => void handleAction(register)}
          >
            Registracija
          </button>
        </div>
      )}
      {error && <p role="alert">{error}</p>}
    </section>
  )
}