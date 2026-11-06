import type { StatusNarocila } from '../../../models/enums/StatusNarocila';

export interface NarociloSeznam {
  id: number;
  narocnik: string;
  vrstaStoritve: string;
  zeleniTermin: string;
  datumOddaje: string;
  status: StatusNarocila;
}