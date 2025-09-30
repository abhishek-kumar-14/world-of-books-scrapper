import useSWR from 'swr'
import { apiClient } from '@/lib/api'
import type { Product } from '@/types/api'

interface RecommendationsResponse {
  data: Product[]
}

export function useRecommendations(productId: string, limit: number = 4) {
  console.log('[useRecommendations] Hook called with productId:', productId)
  
  const { data, error, isLoading, mutate } = useSWR<RecommendationsResponse>(
    productId ? `/products/${productId}/recommendations?limit=${limit}` : null,
    (url) => {
      console.log('[useRecommendations] Making API call to:', url)
      return apiClient.get(url)
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 300000, // 5 minutes
      onError: (error) => {
        console.error('[useRecommendations] SWR Error:', error)
      },
      onSuccess: (data) => {
        console.log('[useRecommendations] SWR Success - Recommendations:', data?.data?.length || 0)
      }
    }
  )

  console.log('[useRecommendations] SWR state:', { data, error, isLoading })

  return {
    recommendations: data?.data || [],
    isLoading,
    error,
    mutate,
  }
}