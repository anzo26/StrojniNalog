import type { StatusDelovnegaNaloga } from '../../../models/enums/StatusDelovnegaNaloga'

export interface EvidencaDela {
  delovniNalogId: number
  opravljeneUre: number | null
  opisIzvedbe: string | null
  razlogDopolnitve: string | null
  status: StatusDelovnegaNaloga
}