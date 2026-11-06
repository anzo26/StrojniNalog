import { Link, useParams } from 'react-router'
import { NarociloPodrobnostiVsebina } from '../components/NarociloPodrobnostiVsebina'

export function NarociloPodrobnostiPage() {
  const { id } = useParams<{ id: string }>()
  const narociloId = Number(id)

  if (!id || !/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(narociloId)) {
    return (
      <div>
        <h1>Neveljavna številka naročila</h1>
        <Link to="/narocila">Nazaj na naročila</Link>
      </div>
    )
  }

  return <NarociloPodrobnostiVsebina key={narociloId} id={narociloId} />
}