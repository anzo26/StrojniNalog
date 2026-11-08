import type { PripravaNalogaFormValues } from './pripravaNalogaFormValues'

export type PripravaNalogaFormErrors = 
    Partial<Record<keyof PripravaNalogaFormValues, string>>