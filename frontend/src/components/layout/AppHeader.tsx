import { useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/Button'

export function AppHeader() {
    const { user, logout } = useAuth()
    const [pending, setPending] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const displayName = user
        ? `${user.firstName} ${user.lastName}`.trim() || user.username
        : null

    async function handleLogout() {
        setPending(true)
        setError(null)
        try {
            await logout()
        } catch {
            setError('Odjava ni uspela. Poskusite znova.')
        } finally {
            setPending(false)
        }
    }

    return (
        <header className="app-header">
            <div className="app-header-content">
                <Link to="/" className="app-brand" aria-label="StrojniNalog – začetna stran">
                    <span className="app-brand-mark" aria-hidden="true">SN</span>
                    <span>StrojniNalog</span>
                </Link>
                {user && (
                    <div className="app-header-account">
                        <Link to="/" className="app-user-link">{displayName}</Link>
                        <Button
                            variant="danger"
                            loading={pending}
                            loadingText="Odjavljanje …"
                            onClick={() => void handleLogout()}
                        >
                            Odjava
                        </Button>
                    </div>
                )}
            </div>
            {error && <p className="app-header-error" role="alert">{error}</p>}
        </header>
    )
}