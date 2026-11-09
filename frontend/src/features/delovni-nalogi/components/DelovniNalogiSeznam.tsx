import type { MouseEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { formatDateTime } from '../../../utils/formatDateTime'
import type { DelovniNalogSeznam } from '../models/delovniNalogSeznam'
import { DelovniNalogStatus } from './DelovniNalogStatus'
import './DelovniNalogiSeznam.css'

interface DelovniNalogiSeznamProps {
  nalogi: DelovniNalogSeznam[]
  prikaziIzvajalca: boolean
}

export function DelovniNalogiSeznam({ nalogi, prikaziIzvajalca }: DelovniNalogiSeznamProps) {
  const navigate = useNavigate()

  function odpriPodrobnosti(event: MouseEvent<HTMLTableRowElement>, id: number) {
    if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
      return
    }

    if (
      event.target instanceof Element &&
      event.target.closest('a, button, input, select, textarea, label')
    ) {
      return
    }

    navigate(`/delovni-nalogi/${id}`)
  }

  return (
    <div className="nalogi-table-container">
      <table className="nalogi-table" aria-label="Delovni nalogi">
        <thead>
          <tr>
            <th scope="col">Nalog</th>
            <th scope="col">Stroj</th>
            {prikaziIzvajalca && <th scope="col">Izvajalec</th>}
            <th scope="col">Predvideni začetek</th>
            <th scope="col">Predvideni konec</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {nalogi.map(nalog => (
            <tr key={nalog.id} onClick={event => odpriPodrobnosti(event, nalog.id)}>
              <th scope="row">
                <Link to={`/delovni-nalogi/${nalog.id}`} className="nalogi-table__link">
                  #{nalog.id}
                </Link>
              </th>
              <td>{nalog.stroj}</td>
              {prikaziIzvajalca && <td>{nalog.izvajalec || '—'}</td>}
              <td>{formatDateTime(nalog.predvideniZacetek)}</td>
              <td>{formatDateTime(nalog.predvideniKonec)}</td>
              <td><DelovniNalogStatus status={nalog.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}