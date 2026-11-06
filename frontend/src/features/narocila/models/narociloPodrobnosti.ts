import type { NarociloSeznam } from './narociloSeznam'

export interface NarociloPodrobnosti extends NarociloSeznam {
  narocnikId: number;
  vrstaStoritveId: number;
  opisDela: string;
  lokacija: string;
  razlogZavrnitve: string | null;
}