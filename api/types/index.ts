export interface HeaderType {
  'Content-Type'?: string
  Authenticate?: string
  Authorization?: string
}

export interface GenericResponse<T> {
  payload: T
  message: string
}
