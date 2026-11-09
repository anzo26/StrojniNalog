import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { useAuth } from '../../../hooks/useAuth'
import { formatDateTime } from '../../../utils/formatDateTime'
import { DelovniNalogStatus } from '../components/DelovniNalogStatus'
import { PotekDela } from '../components/PotekDela'
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
        <Link to="/">Na začetno stran</Link>
      </div>
    )
  }

  return <DelovniNalogPodrobnostiVsebina key={nalogId} id={nalogId} />
}

function DelovniNalogPodrobnostiVsebina({ id }: { id: number }) {
  const { user } = useAuth()
  const { nalog, nalaganje, napaka, osvezi } = useDelovniNalog(id)
  const [obvestilo, setObvestilo] = useState<string | null>(null)

  const nazajNaSeznam =
    (user?.roles.includes('organizator') ?? false) ||
    (user?.roles.includes('izvajalec') ?? false)

  const povezavaNazaj = nazajNaSeznam
    ? '/delovni-nalogi'
    : nalog ? `/narocila/${nalog.narociloId}` : '/narocila'

  const besediloNazaj = nazajNaSeznam
    ? 'Nazaj na delovne naloge'
    : nalog ? 'Nazaj na naročilo' : 'Nazaj na naročila'

  function obUspehu(sporocilo: string) {
    setObvestilo(sporocilo)
    osvezi()
  }

  return (
    <div className="nalog-podrobnosti">
      <Link
        to={povezavaNazaj}
        className="button button--secondary nalog-podrobnosti__back"
      >
        {besediloNazaj}
      </Link>

      <header className="nalog-podrobnosti__heading">
        <h1>Delovni nalog #{id}</h1>
        {nalog && <DelovniNalogStatus status={nalog.status} />}
      </header>

      {obvestilo && (
        <div className="nalog-podrobnosti__success" role="status">
          {obvestilo}
        </div>
      )}

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
        )}
      </section>

      {!nalaganje && !napaka && nalog?.jeDodeljenIzvajalec && (
        <PotekDela nalog={nalog} onUspeh={obUspehu} onOsvezi={osvezi} />
      )}
    </div>
  )
}