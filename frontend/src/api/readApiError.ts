import { ApiError } from './ApiError'
import type { ApiProblem } from './models/apiProblem'

export async function readApiError(
  response: Response,
  fallbackMessage: string,
): Promise<ApiError> {
  try {
    const body: unknown = await response.json()

    if (body === null || typeof body !== 'object' || Array.isArray(body)) {
      return new ApiError(response.status, fallbackMessage)
    }

    const problem = body as ApiProblem & Record<string, unknown>
    const detail = typeof problem.detail === 'string' ? problem.detail.trim() : ''
    const title = typeof problem.title === 'string' ? problem.title.trim() : ''

    return new ApiError(
      response.status,
      detail || title || fallbackMessage,
      problem.errors ?? {},
      problem,
    )
  } catch {
    return new ApiError(response.status, fallbackMessage)
  }
}