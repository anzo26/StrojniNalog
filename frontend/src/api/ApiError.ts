export class ApiError extends Error {
  readonly status: number
  readonly errors: Record<string, string[]>
  readonly problem: Readonly<Record<string, unknown>>

  constructor(
    status: number,
    message: string,
    errors: Record<string, string[]> = {},
    problem: Readonly<Record<string, unknown>> = {},
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
    this.problem = problem
  }
}