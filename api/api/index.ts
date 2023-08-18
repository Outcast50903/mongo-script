import axios, { type AxiosInstance } from 'axios'

import HttpClient from '../class'
import { type HeaderType } from '../types'

/**
 * A class that extends HttpClient and provides methods for making HTTP requests using Axios.
 * @extends HttpClient
 */
export class Api extends HttpClient {
  api: AxiosInstance

  /**
   * Creates an instance of Api.
   * @param {string} baseUrl - The base URL for the API.
   * @param {HeaderType} [headers] - The headers to be included in the requests.
   */
  constructor (
    baseUrl: string,
    headers?: HeaderType
  ) {
    super()
    this.api = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.api.interceptors.request.use(config => {
      ((headers?.Authenticate) != null)
        ? config.headers.Authenticate = headers?.Authenticate ?? headers?.Authorization ?? ''
        : config.headers.Authorization = headers?.Authenticate ?? headers?.Authorization ?? ''

      return config
    })
  }

  /**
   * Sends a GET request to the specified URL.
   * @async
   * @template TResponse - The expected response type.
   * @param {string} url - The URL to send the request to.
   * @returns {Promise<TResponse>} - A promise that resolves with the response data or null if an error occurs.
   */
  async get<TResponse>(url: string): Promise<TResponse> {
    try {
      const { data } = await this.api.get<TResponse>(url)
      return data
    } catch (error) {
      return null as TResponse
    }
  }

  /**
   * Sends a POST request to the specified URL with the provided body.
   * @async
   * @template TResponse - The expected response type.
   * @template UBody - The type of the request body.
   * @param {string} url - The URL to send the request to.
   * @param {UBody} body - The request body.
   * @returns {Promise<TResponse>} - A promise that resolves with the response data or null if an error occurs.
   */
  async post<TResponse, UBody = null>(
    url: string,
    body: UBody
  ): Promise<TResponse> {
    try {
      const { data } = await this.api.post<TResponse>(url, body)
      return data
    } catch (error) {
      return null as TResponse
    }
  }

  /**
   * Sends a PUT request to the specified URL with the provided body.
   * @async
   * @template TResponse - The expected response type.
   * @template UBody - The type of the request body.
   * @param {string} url - The URL to send the request to.
   * @param {UBody} body - The request body.
   * @returns {Promise<TResponse>} - A promise that resolves with the response data or null if an error occurs.
   */
  async put<TResponse, UBody = null>(
    url: string,
    body: UBody
  ): Promise<TResponse> {
    try {
      const { data } = await this.api.put<TResponse>(url, body)
      return data
    } catch (error) {
      return null as TResponse
    }
  }

  /**
   * Sends a PATCH request to the specified URL with the provided body.
   * @async
   * @template TResponse - The expected response type.
   * @template UBody - The type of the request body.
   * @param {string} url - The URL to send the request to.
   * @param {UBody} body - The request body.
   * @returns {Promise<TResponse>} - A promise that resolves with the response data or null if an error occurs.
   */
  async patch<TResponse, UBody = null>(
    url: string,
    body: UBody
  ): Promise<TResponse> {
    try {
      const { data } = await this.api.patch<TResponse>(url, body)
      return data
    } catch (error) {
      return null as TResponse
    }
  }

  /**
   * Sends a DELETE request to the specified URL.
   * @async
   * @template TResponse - The expected response type.
   * @param {string} url - The URL to send the request to.
   * @returns {Promise<TResponse>} - A promise that resolves with the response data or null if an error occurs.
   */
  async delete<TResponse>(
    url: string
  ): Promise<TResponse> {
    try {
      const { data } = await this.api.delete<TResponse>(url)
      return data
    } catch (error) {
      return null as TResponse
    }
  }
}
