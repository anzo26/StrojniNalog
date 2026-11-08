import { ApiError } from '../../../api/ApiError'
import type { KonfliktZasedenosti } from '../models/konfliktZasedenosti'

export function preberiKonfliktZasedenosti(
  error: ApiError,
): KonfliktZasedenosti | null {
  if (error.status !== 409) return null

  const { strojZaseden, izvajalecZaseden } = error.problem

  if (
    typeof strojZaseden !== 'boolean' ||
    typeof izvajalecZaseden !== 'boolean' ||
    (!strojZaseden && !izvajalecZaseden)
  ) {
    return null
  }

  return { strojZaseden, izvajalecZaseden }
}