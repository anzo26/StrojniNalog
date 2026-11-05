import type { StatusNarocila } from "../../../models/enums/StatusNarocila"

export interface OddanoNarocilo {
  id: number
  status: StatusNarocila
  datumOddaje: string
}