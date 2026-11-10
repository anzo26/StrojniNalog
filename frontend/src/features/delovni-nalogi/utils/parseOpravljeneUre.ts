export function parseOpravljeneUre(value: string): number | null {
  const besedilo = value.trim()

  if (!/^(?:\d+(?:[.,]\d+)?|[.,]\d+)$/.test(besedilo)) {
    return null
  }

  const ure = Number(besedilo.replace(',', '.'))

  return Number.isFinite(ure) ? ure : null
}