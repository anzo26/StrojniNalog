import { Link } from 'react-router'
import { useAuth } from '../../../hooks/useAuth'
import { NarocilaSeznam } from '../components/NarocilaSeznam'
import { useNarocila } from '../hooks/useNarocila'
import '../../../components/ui/Button.css'
import './NarocilaPage.css'

export function NarocilaPage() {
  const { user } = useAuth()
  const { narocila, nalaganje, napaka, osvezi } = useNarocila()
  const jeNarocnik = user?.roles.includes('narocnik') ?? false
  const jeOrganizator = user?.roles.includes('organizator') ?? false

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

      {nalaganje && (
        <div className="narocila-state" role="status">
          Nalaganje naročil …
        </div>
      )}

      {!nalaganje && napaka && (
        <div className="narocila-state" role="alert">
          <p>{napaka}</p>
          <button type="button" className="button button--secondary" onClick={osvezi}>
            Poskusi ponovno
          </button>
        </div>
      )}

      {!nalaganje && !napaka && narocila.length === 0 && (
        <div className="narocila-state">
          <p>Trenutno ni naročil za prikaz.</p>
        </div>
      )}

      {!nalaganje && !napaka && narocila.length > 0 && (
        <NarocilaSeznam narocila={narocila} prikaziNarocnika={jeOrganizator} />
      )}
    </div>
  )
}