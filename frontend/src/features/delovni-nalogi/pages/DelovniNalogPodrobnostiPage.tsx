import { Link, useParams } from 'react-router'
import { formatDateTime } from '../../../utils/formatDateTime'
import { DelovniNalogStatus } from '../components/DelovniNalogStatus'
import { useDelovniNalog } from '../hooks/useDelovniNalog'
import '../../../components/ui/Button.css'
import './DelovniNalogPodrobnostiPage.css'

export function DelovniNalogPodrobnostiPage() {
  const { id } = useParams<{ id: string }>()
  const nalogId = Number(id)

  if (!id || !/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(nalogId)) {
    return (
      <div>
        <h1>Neveljavna številka delovnega naloga</h1>
        <Link to="/narocila">Nazaj na naročila</Link>
      </div>
    )
  }

  return <DelovniNalogPodrobnostiVsebina key={nalogId} id={nalogId} />
}

function DelovniNalogPodrobnostiVsebina({ id }: { id: number }) {
  const { nalog, nalaganje, napaka, osvezi } = useDelovniNalog(id)

  return (
    <div className="nalog-podrobnosti">
      <Link
        to={nalog ? `/narocila/${nalog.narociloId}` : '/narocila'}
        className="button button--secondary nalog-podrobnosti__back"
      >
        {nalog ? 'Nazaj na naročilo' : 'Nazaj na naročila'}
      </Link>

      <header className="nalog-podrobnosti__heading">
        <h1>Delovni nalog #{id}</h1>
        {nalog && <DelovniNalogStatus status={nalog.status} />}
      </header>

      <section className="nalog-podrobnosti__panel" aria-label="Podatki delovnega naloga">
        {nalaganje && <p role="status">Nalaganje delovnega naloga …</p>}

        {!nalaganje && napaka && (
          <div className="nalog-podrobnosti__error" role="alert">
            <p>{napaka}</p>
            <button type="button" className="button button--secondary" onClick={osvezi}>
              Poskusi ponovno
            </button>
          </div>
        )}

        {!nalaganje && !napaka && nalog && (
          <dl className="nalog-podrobnosti__podatki">
            <div>
              <dt>Stroj</dt>
              <dd>{nalog.stroj}</dd>
            </div>
            <div>
              <dt>Izvajalec</dt>
              <dd>{nalog.izvajalec || '—'}</dd>
            </div>
            <div>
              <dt>Predvideni začetek</dt>
              <dd>{formatDateTime(nalog.predvideniZacetek)}</dd>
            </div>
            <div>
              <dt>Predvideni konec</dt>
              <dd>{formatDateTime(nalog.predvideniKonec)}</dd>
            </div>
          </dl>
        )}
      </section>
    </div>
  )
}