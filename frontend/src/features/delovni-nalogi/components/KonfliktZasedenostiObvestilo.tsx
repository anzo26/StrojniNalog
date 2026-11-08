import type { KonfliktZasedenosti } from '../models/konfliktZasedenosti'
import './KonfliktZasedenostiObvestilo.css'

interface KonfliktZasedenostiObvestiloProps {
  konflikt: KonfliktZasedenosti
}

export function KonfliktZasedenostiObvestilo({
  konflikt,
}: KonfliktZasedenostiObvestiloProps) {
  const opis = konflikt.strojZaseden && konflikt.izvajalecZaseden
    ? 'V izbranem terminu sta zasedena stroj in izvajalec.'
    : konflikt.strojZaseden
      ? 'V izbranem terminu je stroj zaseden.'
      : 'V izbranem terminu je izvajalec zaseden.'

  return (
    <div className="konflikt-zasedenosti" role="alert">
      <h3>Termina ni mogoče shraniti</h3>
      <p>{opis}</p>
      <p>Spremenite termin, stroj ali izvajalca in ponovno poskusite.</p>
    </div>
  )
}