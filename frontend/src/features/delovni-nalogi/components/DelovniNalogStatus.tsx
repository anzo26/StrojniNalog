import { StatusBadge } from '../../../components/ui/StatusBadge'
import type { StatusDelovnegaNaloga } from '../../../models/enums/StatusDelovnegaNaloga'

interface DelovniNalogStatusProps {
  status: StatusDelovnegaNaloga
}

const prikazi = {
  NACRTOVAN: { label: 'Načrtovan', tone: 'info' },
  V_IZVAJANJU: { label: 'V izvajanju', tone: 'progress' },
  CAKA_NA_PREGLED: { label: 'Čaka na pregled', tone: 'warning' },
  ZAKLJUCEN: { label: 'Zaključen', tone: 'success' },
  V_DOPOLNITVI: { label: 'V dopolnitvi', tone: 'danger' },
} as const

export function DelovniNalogStatus({ status }: DelovniNalogStatusProps) {
  const prikaz = prikazi[status]
  return <StatusBadge label={prikaz.label} tone={prikaz.tone} />
}