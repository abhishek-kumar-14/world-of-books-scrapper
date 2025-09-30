const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

console.log('[API] Environment check:', {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  API_BASE_URL,
  NODE_ENV: process.env.NODE_ENV
})

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    console.log('[API] ApiClient constructor called with baseURL:', baseURL)
    this.baseURL = baseURL || 'http://localhost:3001'
    
    if (!this.baseURL) {
      console.error('[API] ERROR: baseURL is undefined!')
      this.baseURL = 'http://localhost:3001'
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`
    
    console.log('[API] Making GET request to:', url)
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      console.log('[API] Response received:', {
        url,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('[API] Error response body:', errorText)
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log('[API] JSON data received:', data)
      return data
    } catch (error) {
      console.error('[API] Request completely failed:', error)
      throw error
    }
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      return response.json()
    } catch (error) {
      console.error('API Request failed:', error)
      throw error
    }
  }
}

// Create a singleton instance with fallback
export const apiClient = new ApiClient(API_BASE_URL)

// Export a simple fetch function as backup
export const apiFetch = async <T>(endpoint: string): Promise<T> => {
  const baseUrl = 'http://localhost:3001'
  const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`
  
  console.log('[apiFetch] Making request to:', url)
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}