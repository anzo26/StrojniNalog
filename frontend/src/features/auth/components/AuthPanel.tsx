import { useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { useAuth } from '../../../hooks/useAuth'
import './AuthPanel.css'
import { UserProfileCard } from './UserProfileCard'

export function AuthPanel() {
  const { user, login, register } = useAuth()
  const [pending, setPending] = useState<'login' | 'register' | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleAction(action: 'login' | 'register') {
    setPending(action)
    setError(null)
    try {
      await (action === 'login' ? login() : register())
    } catch {
      setError('Dejanje ni uspelo. Poskusite znova.')
    } finally {
      setPending(null)
    }
  }

  return (
    <div className="account-page">
      <div className="account-heading">
        <h1>{user ? 'Vaš račun' : 'Dobrodošli v StrojniNalog'}</h1>
        <p>
          {user
            ? 'Podatki vašega uporabniškega računa.'
            : 'Naročila, razpored in izvedba na enem mestu.'}
        </p>
      </div>
      {user ? (
        <UserProfileCard key={user.authId} username={user.username} />
      ) : (
        <Card aria-labelledby="account-login-title">
          <h2 id="account-login-title">Dostop do aplikacije</h2>
          <p>Prijavite se v svoj račun ali se registrirajte kot naročnik.</p>
          <div className="auth-actions">
            <Button
              disabled={pending !== null}
              loading={pending === 'login'}
              loadingText="Preusmerjanje …"
              onClick={() => void handleAction('login')}
            >
              Prijava
            </Button>
            <Button
              variant="secondary"
              disabled={pending !== null}
              loading={pending === 'register'}
              loadingText="Preusmerjanje …"
              onClick={() => void handleAction('register')}
            >
              Registracija
            </Button>
          </div>
          {error && <p className="account-error" role="alert">{error}</p>}
        </Card>
      )}
    </div>
  )
}