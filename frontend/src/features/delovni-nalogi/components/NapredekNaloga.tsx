import { Link } from 'react-router'
import { formatDateTime } from '../../../utils/formatDateTime'
import { useDelovniNalog } from '../hooks/useDelovniNalog'
import { DelovniNalogStatus } from './DelovniNalogStatus'
import '../../../components/ui/Button.css'
import './NapredekNaloga.css'

interface NapredekNalogaProps {
  nalogId: number
}

export function NapredekNaloga({ nalogId }: NapredekNalogaProps) {
  const { nalog, nalaganje, napaka, osvezi } = useDelovniNalog(nalogId)

  return (
    <section className="napredek-naloga" aria-label="Napredek izvedbe">
      <header className="napredek-naloga__heading">
        <h2>Napredek izvedbe</h2>
        <button
          type="button"
          className="button button--secondary"
          onClick={osvezi}
          disabled={nalaganje}
        >
          Osveži
        </button>
      </header>

      {nalaganje && <p role="status">Nalaganje napredka …</p>}

      {!nalaganje && napaka && (
        <p className="napredek-naloga__error" role="alert">{napaka}</p>
      )}

      {!nalaganje && !napaka && nalog && (
        <>
          <DelovniNalogStatus status={nalog.status} />

          <dl className="napredek-naloga__podatki">
            <div>
              <dt>Dejanski začetek</dt>
              <dd>
                {nalog.dejanskiZacetek
                  ? formatDateTime(nalog.dejanskiZacetek)
                  : 'Še ni zabeležen'}
              </dd>
            </div>
            <div>
              <dt>Dejanski konec</dt>
              <dd>
                {nalog.dejanskiKonec
                  ? formatDateTime(nalog.dejanskiKonec)
                  : 'Še ni zabeležen'}
              </dd>
            </div>
          </dl>

          <Link to={`/delovni-nalogi/${nalog.id}`} className="button button--primary">
            Preglej delovni nalog
          </Link>
        </>
      )}
    </section>
  )
}