import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { StatusBadge } from '../../../components/ui/StatusBadge'
import { statusNarocilaLabels } from '../../../models/enums/StatusNarocila'
import type { OddanoNarocilo } from '../models/oddanoNarocilo'

interface PotrditevOddajeProps {
  narocilo: OddanoNarocilo
  onNovoNarocilo: () => void
}

export function PotrditevOddaje({
  narocilo,
  onNovoNarocilo,
}: PotrditevOddajeProps) {
  return (
    <Card>
      <div role="status">
        <h2>Naročilo #{narocilo.id} je uspešno oddano</h2>
        <p>Organizator bo pregledal vaše naročilo in želeni termin.</p>
        <StatusBadge
          label={statusNarocilaLabels[narocilo.status]}
          tone="success"
        />
      </div>
      <div className="narocilo-form-actions">
        <Button variant="secondary" onClick={onNovoNarocilo}>
          Oddaj novo naročilo
        </Button>
      </div>
    </Card>
  )
}