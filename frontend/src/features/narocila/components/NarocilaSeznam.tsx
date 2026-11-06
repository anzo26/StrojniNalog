import type { MouseEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { formatDateTime } from '../../../utils/formatDateTime'
import type { NarociloSeznam } from '../models/narociloSeznam'
import { NarociloStatus } from './NarociloStatus'
import './NarocilaSeznam.css'

interface NarocilaSeznamProps {
  narocila: NarociloSeznam[]
  prikaziNarocnika: boolean
}

export function NarocilaSeznam({ narocila, prikaziNarocnika }: NarocilaSeznamProps) {
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

    navigate(`/narocila/${id}`)
  }

  return (
    <div className="narocila-table-container">
      <table className="narocila-table" aria-label="Seznam naročil">
        <thead>
          <tr>
            <th scope="col">Naročilo</th>
            {prikaziNarocnika && <th scope="col">Naročnik</th>}
            <th scope="col">Vrsta storitve</th>
            <th scope="col">Želeni termin</th>
            <th scope="col">Datum oddaje</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {narocila.map((narocilo) => (
            <tr
              key={narocilo.id}
              className="narocila-table__row"
              onClick={(event) => odpriPodrobnosti(event, narocilo.id)}
            >
              <th scope="row">
                <Link to={`/narocila/${narocilo.id}`} className="narocila-table__link">
                  #{narocilo.id}
                </Link>
              </th>
              {prikaziNarocnika && <td>{narocilo.narocnik || '—'}</td>}
              <td>{narocilo.vrstaStoritve}</td>
              <td>{formatDateTime(narocilo.zeleniTermin)}</td>
              <td>{formatDateTime(narocilo.datumOddaje)}</td>
              <td>
                <NarociloStatus status={narocilo.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}