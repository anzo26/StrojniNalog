import { formatDateTime } from '../../../utils/formatDateTime'
import type { NarociloPodrobnosti } from '../models/narociloPodrobnosti'
import './NarociloPodatki.css'

interface NarociloPodatkiProps {
  narocilo: NarociloPodrobnosti
  prikaziNarocnika: boolean
}

export function NarociloPodatki({ narocilo, prikaziNarocnika }: NarociloPodatkiProps) {
  return (
    <dl className="narocilo-podatki">
      {prikaziNarocnika && (
        <div>
          <dt>Naročnik</dt>
          <dd>{narocilo.narocnik || '—'}</dd>
        </div>
      )}

      <div>
        <dt>Vrsta storitve</dt>
        <dd>{narocilo.vrstaStoritve}</dd>
      </div>

      <div>
        <dt>Želeni termin</dt>
        <dd>{formatDateTime(narocilo.zeleniTermin)}</dd>
      </div>

      <div>
        <dt>Datum oddaje</dt>
        <dd>{formatDateTime(narocilo.datumOddaje)}</dd>
      </div>

      <div className="narocilo-podatki__wide">
        <dt>Lokacija</dt>
        <dd>{narocilo.lokacija}</dd>
      </div>

      <div className="narocilo-podatki__wide">
        <dt>Opis dela</dt>
        <dd>{narocilo.opisDela}</dd>
      </div>

      {narocilo.razlogZavrnitve && (
        <div className="narocilo-podatki__wide narocilo-podatki__zavrnitev">
          <dt>Razlog zavrnitve</dt>
          <dd>{narocilo.razlogZavrnitve}</dd>
        </div>
      )}
    </dl>
  )
}