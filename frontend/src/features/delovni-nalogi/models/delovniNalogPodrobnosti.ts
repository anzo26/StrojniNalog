import type { StatusDelovnegaNaloga } from '../../../models/enums/StatusDelovnegaNaloga'

export interface DelovniNalogPodrobnosti {
  id: number
  narociloId: number
  strojId: number
  stroj: string
  izvajalecId: number
  izvajalec: string
  predvideniZacetek: string
  predvideniKonec: string
  status: StatusDelovnegaNaloga
}