import type { StatusDelovnegaNaloga } from '../../../models/enums/StatusDelovnegaNaloga'

export interface PripravljenDelovniNalog {
  id: number
  status: StatusDelovnegaNaloga
}