import { useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { useAuth } from '../../../hooks/useAuth'
import { userRoleLabels } from '../models/authUser'
import './AuthPanel.css'

export function AuthPanel() {
  const { user, login, register } = useAuth()
  const [pending, setPending] = useState<'login' | 'register' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const displayName = user
    ? `${user.firstName} ${user.lastName}`.trim() || user.username
    : ''

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
        <Card aria-labelledby="account-name">
          <h2 id="account-name">{displayName}</h2>
          <dl className="account-details">
            <div>
              <dt>Uporabniško ime</dt>
              <dd>{user.username}</dd>
            </div>
            <div>
              <dt>E-pošta</dt>
              <dd>{user.email || 'Ni navedena'}</dd>
            </div>
            <div>
              <dt>Vloga</dt>
              <dd>
                {user.roles.map(role => userRoleLabels[role]).join(', ')
                  || 'Brez poslovne vloge'}
              </dd>
            </div>
          </dl>
        </Card>
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