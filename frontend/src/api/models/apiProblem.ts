export interface ApiProblem {
  title?: string
  detail?: string
  status?: number
  errors?: Record<string, string[]>
}