import { useAuth } from '../../../hooks/useAuth'
import { DelovniNalogiSeznam } from '../components/DelovniNalogiSeznam'
import { useDelovniNalogi } from '../hooks/useDelovniNalogi'
import '../../../components/ui/Button.css'
import './DelovniNalogiPage.css'

export function DelovniNalogiPage() {
  const { user } = useAuth()
  const { nalogi, nalaganje, napaka, osvezi } = useDelovniNalogi()
  const jeOrganizator = user?.roles.includes('organizator') ?? false

  return (
    <div className="delovni-nalogi-page">
      <div className="delovni-nalogi-heading">
        <h1>{jeOrganizator ? 'Delovni nalogi' : 'Moji delovni nalogi'}</h1>
        <button
          type="button"
          className="button button--secondary"
          onClick={osvezi}
          disabled={nalaganje}
        >
          Osveži
        </button>
      </div>

      {nalaganje && (
        <div className="delovni-nalogi-state" role="status">
          Nalaganje delovnih nalogov …
        </div>
      )}

      {!nalaganje && napaka && (
        <div className="delovni-nalogi-state" role="alert">
          <p>{napaka}</p>
          <button type="button" className="button button--secondary" onClick={osvezi}>
            Poskusi ponovno
          </button>
        </div>
      )}

      {!nalaganje && !napaka && nalogi.length === 0 && (
        <div className="delovni-nalogi-state">
          Trenutno ni delovnih nalogov za prikaz.
        </div>
      )}

      {!nalaganje && !napaka && nalogi.length > 0 && (
        <DelovniNalogiSeznam nalogi={nalogi} prikaziIzvajalca={jeOrganizator} />
      )}
    </div>
  )
}