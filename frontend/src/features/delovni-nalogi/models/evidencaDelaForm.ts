import type { EvidencaDela } from './evidencaDela'

export interface EvidencaDelaFormValues {
  opravljeneUre: string
  opisIzvedbe: string
}

export type EvidencaDelaFormErrors =Partial<Record<keyof EvidencaDelaFormValues, string>>

export type EvidencaDelaDejanje = 'shrani' | 'oddaj'

export function ustvariEvidencoDelaForm(
  evidenca?: EvidencaDela,
): EvidencaDelaFormValues {
  return {
    opravljeneUre: evidenca?.opravljeneUre?.toString() ?? '',
    opisIzvedbe: evidenca?.opisIzvedbe ?? '',
  }
}