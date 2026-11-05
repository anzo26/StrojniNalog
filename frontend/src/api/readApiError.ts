import { ApiError } from './ApiError'
import type { ApiProblem } from './models/apiProblem'

export async function readApiError(response: Response,fallbackMessage: string,): Promise<ApiError> {
  try {
    const problem = await response.json() as ApiProblem | null

    return new ApiError(
      response.status,
      problem?.detail || problem?.title || fallbackMessage,
      problem?.errors ?? {},
    )
  } catch {
    return new ApiError(response.status, fallbackMessage)
  }
}