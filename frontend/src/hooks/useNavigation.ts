import useSWR from 'swr'
import { apiClient } from '@/lib/api'
import type { Navigation } from '@/types/api'

export function useNavigation() {
  const { data, error, isLoading, mutate } = useSWR<Navigation[]>(
    '/navigation',
    (url) => apiClient.get(url),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1 minute
      onError: (error) => {
        console.error('Navigation fetch error:', error)
      },
      onSuccess: (data) => {
        console.log('Navigation fetch success:', data)
      }
    }
  )

  console.log('Navigation hook state:', { data, error, isLoading })

  return {
    navigation: data,
    isLoading,
    error,
    mutate,
  }
}