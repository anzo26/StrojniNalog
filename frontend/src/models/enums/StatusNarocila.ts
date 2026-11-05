export enum StatusNarocila {
  Oddano = 'ODDANO',
  Potrjeno = 'POTRJENO',
  Zavrnjeno = 'ZAVRNJENO',
}

export const statusNarocilaLabels: Record<StatusNarocila, string> = {
  [StatusNarocila.Oddano]: 'Oddano',
  [StatusNarocila.Potrjeno]: 'Potrjeno',
  [StatusNarocila.Zavrnjeno]: 'Zavrnjeno',
}