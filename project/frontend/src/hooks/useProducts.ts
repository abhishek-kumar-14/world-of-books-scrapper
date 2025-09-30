import useSWR from 'swr'
import { apiClient } from '@/lib/api'
import type { Product, PaginatedResponse } from '@/types/api'

interface UseProductsParams {
  categorySlug?: string
  limit?: number
}

export function useProducts({ categorySlug, limit = 100 }: UseProductsParams = {}) {
  const params = new URLSearchParams()
  if (categorySlug) params.append('categorySlug', categorySlug)
  params.append('limit', limit.toString())
  
  const endpoint = `/products?${params.toString()}`
  
  console.log('[useProducts] Hook called with:', { categorySlug, limit, endpoint })
  
  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Product>>(
    endpoint,
    (url) => {
      console.log('[useProducts] Making API call to:', url)
      return apiClient.get(url)
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5000, // 5 seconds
      revalidateIfStale: true,
      revalidateOnMount: true,
      onError: (error) => {
        console.error('[useProducts] SWR Error:', error)
      },
      onSuccess: (data) => {
        console.log('[useProducts] SWR Success - Products received:', data?.data?.length || 0)
        if (data?.data?.length > 0) {
          console.log('[useProducts] First product:', data.data[0].title, 'by', data.data[0].author)
        }
      }
    }
  )

  console.log('[useProducts] SWR state:', { data, error, isLoading })

  return {
    products: data?.data,
    pagination: data?.pagination,
    isLoading,
    error,
    mutate,
  }
}