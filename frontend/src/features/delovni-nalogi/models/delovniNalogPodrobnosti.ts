import type { DelovniNalogSeznam } from './delovniNalogSeznam'

export interface DelovniNalogPodrobnosti extends DelovniNalogSeznam {
  strojId: number
  izvajalecId: number
  jeDodeljenIzvajalec: boolean
}