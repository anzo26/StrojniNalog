import { StatusBadge } from '../../../components/ui/StatusBadge'
import {
  StatusNarocila,
  statusNarocilaLabels,
} from '../../../models/enums/StatusNarocila'

interface NarociloStatusProps {
  status: StatusNarocila
}

const statusTones: Record<StatusNarocila, 'info' | 'success' | 'danger'> = {
  [StatusNarocila.Oddano]: 'info',
  [StatusNarocila.Potrjeno]: 'success',
  [StatusNarocila.Zavrnjeno]: 'danger',
}

export function NarociloStatus({ status }: NarociloStatusProps) {
  return <StatusBadge label={statusNarocilaLabels[status]} tone={statusTones[status]} />
}