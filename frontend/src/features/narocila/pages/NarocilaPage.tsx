import { Link } from 'react-router'
import { useAuth } from '../../../hooks/useAuth'
import '../../../components/ui/Button.css'
import './NarocilaPage.css'

export function NarocilaPage() {
  const { user } = useAuth()
  const jeNarocnik = user?.roles.includes('narocnik') ?? false

  return (
    <div>
      <div className="narocila-heading">
        <h1>Naročila</h1>
        {jeNarocnik && (
          <Link to="/narocila/novo" className="button button--primary">
            Novo naročilo
          </Link>
        )}
      </div>
    </div>
  )
}