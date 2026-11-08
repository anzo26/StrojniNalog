export interface PripravaNalogaFormValues {
  strojId: string
  izvajalecId: string
  predvideniZacetek: string
  predvideniKonec: string
}

export function ustvariPraznoPripravoNaloga(): PripravaNalogaFormValues {
  return {
    strojId: '',
    izvajalecId: '',
    predvideniZacetek: '',
    predvideniKonec: '',
  }
}