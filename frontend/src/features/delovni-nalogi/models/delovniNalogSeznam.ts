import type { StatusDelovnegaNaloga } from '../../../models/enums/StatusDelovnegaNaloga'

export interface DelovniNalogSeznam {
  id: number
  narociloId: number
  stroj: string
  izvajalec: string
  predvideniZacetek: string
  predvideniKonec: string
  dejanskiZacetek: string | null
  dejanskiKonec: string | null
  status: StatusDelovnegaNaloga
}