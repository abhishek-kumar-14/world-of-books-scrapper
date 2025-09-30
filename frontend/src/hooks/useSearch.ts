import useSWR from 'swr'
import { apiClient } from '@/lib/api'
import type { SearchResponse } from '@/types/api'

export function useSearch({ query, page = 1, limit = 20, minPrice, maxPrice, author, minRating }: 
 { query: string; page?: number; limit?: number; minPrice?: number; maxPrice?: number; author?: string; minRating?: number; }) {
  const params = new URLSearchParams()
  if (query) params.set('q', query)
  params.set('page', String(page))
  params.set('limit', String(limit))
  if (minPrice !== undefined) params.set('minPrice', String(minPrice))
  if (maxPrice !== undefined) params.set('maxPrice', String(maxPrice))
  if (author) params.set('author', author)
  if (minRating !== undefined) params.set('minRating', String(minRating))

  const endpoint = `/search?${params.toString()}`
  const { data, error, isLoading, mutate } = useSWR<SearchResponse>(endpoint, (url)=>apiClient.get(url), {
    revalidateOnFocus: false, dedupingInterval: 30000
  })
  return { results: data?.data, pagination: data?.pagination, isLoading, error, mutate }
}
