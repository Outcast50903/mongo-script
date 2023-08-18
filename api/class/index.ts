/**
 * Abstract class representing an HTTP client.
 * @abstract
 */
export default abstract class HttpClient {
  /**
   * Sends an HTTP GET request to the specified URL.
   * @abstract
   * @param {string} url - The URL to send the request to.
   * @returns {Promise<Data>} - A promise that resolves with the response data.
   * @template Data - The type of the response data.
   */
  abstract get<Data>(url: string): Promise<Data>

  /**
   * Sends an HTTP POST request to the specified URL.
   * @abstract
   * @param {string} url - The URL to send the request to.
   * @param {Body} [data] - The data to send in the request body.
   * @returns {Promise<Data>} - A promise that resolves with the response data.
   * @template Data - The type of the response data.
   * @template Body - The type of the request body data.
   */
  abstract post<Data, Body = null>(url: string, data?: Body): Promise<Data>

  /**
   * Sends an HTTP PUT request to the specified URL.
   * @abstract
   * @param {string} url - The URL to send the request to.
   * @param {Body} [data] - The data to send in the request body.
   * @returns {Promise<Data>} - A promise that resolves with the response data.
   * @template Data - The type of the response data.
   * @template Body - The type of the request body data.
   */
  abstract put<Data, Body = null>(url: string, data?: Body): Promise<Data>

  /**
   * Sends an HTTP PATCH request to the specified URL.
   * @abstract
   * @param {string} url - The URL to send the request to.
   * @param {Body} [data] - The data to send in the request body.
   * @returns {Promise<Data>} - A promise that resolves with the response data.
   * @template Data - The type of the response data.
   * @template Body - The type of the request body data.
   */
  abstract patch<Data, Body = null>(url: string, data?: Body): Promise<Data>

  /**
   * Sends an HTTP DELETE request to the specified URL.
   * @abstract
   * @param {string} url - The URL to send the request to.
   * @param {Body} [data] - The data to send in the request body.
   * @returns {Promise<Data>} - A promise that resolves with the response data.
   * @template Data - The type of the response data.
   * @template Body - The type of the request body data.
   */
  abstract delete<Data, Body = null>(url: string, data?: Body): Promise<Data>
}
