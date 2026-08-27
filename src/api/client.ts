import axios, { AxiosError } from 'axios'
import type { ApiError } from '@/types'

// Centralized Axios instance. All requests to the FastAPI backend
// go through here so base URL / auth headers / interceptors only
// need to be configured once.
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Normalizes any Axios failure into a small, UI-friendly shape so
// components never need to know about Axios/HTTP internals.
export function toApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<{ detail?: string; message?: string }>
    if (!err.response) {
      return { status: 'network', message: 'Unable to reach the fraud detection server.' }
    }
    const status = err.response.status
    const detail = err.response.data?.detail || err.response.data?.message
    if (status === 404) return { status, message: detail || 'No record found for this request.' }
    if (status === 400) return { status, message: detail || 'The request was invalid.' }
    if (status >= 500) return { status, message: detail || 'The server encountered an error.' }
    return { status, message: detail || 'The request failed.' }
  }
  return { status: 'network', message: 'An unexpected error occurred.' }
}

export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true'
