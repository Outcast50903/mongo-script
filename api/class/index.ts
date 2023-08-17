export default abstract class HttpClient {
  abstract get<Data>(url: string): Promise<Data>
  abstract post<Data, Body = null>(url: string, data?: Body): Promise<Data>
  abstract put<Data, Body = null>(url: string, data?: Body): Promise<Data>
  abstract patch<Data, Body = null>(url: string, data?: Body): Promise<Data>
  abstract delete<Data, Body = null>(url: string, data?: Body): Promise<Data>
}
