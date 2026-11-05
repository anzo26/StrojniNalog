export function parseLokalniTermin(value: string): Date | null {
  const zapis = value.trim()
  const ujemanje = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(zapis)

  if (!ujemanje) {
    return null
  }

  const datum = new Date(zapis)

  if (!Number.isFinite(datum.getTime())) {
    return null
  }

  const pricakovano = ujemanje.slice(1).map(Number)
  const dejansko = [
    datum.getFullYear(),
    datum.getMonth() + 1,
    datum.getDate(),
    datum.getHours(),
    datum.getMinutes(),
  ]

  if (pricakovano[0] < 1 || dejansko.some((vrednost, index) => vrednost !== pricakovano[index])) {
    return null
  }

  return datum
}