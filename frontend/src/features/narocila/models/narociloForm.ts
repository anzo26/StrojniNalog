export interface NarociloFormValues {
  vrstaStoritveId: string
  opisDela: string
  lokacija: string
  zeleniTermin: string
}

export type NarociloFormErrors = Partial<Record<keyof NarociloFormValues, string>>

export function ustvariPraznoNarocilo(): NarociloFormValues {
  return {
    vrstaStoritveId: '',
    opisDela: '',
    lokacija: '',
    zeleniTermin: '',
  }
}