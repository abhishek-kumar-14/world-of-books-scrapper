import useSWR from 'swr'
import { apiClient, apiFetch } from '@/lib/api'
import type { Category } from '@/types/api'

export function useCategories(slug?: string) {
  const endpoint = slug ? `/categories/${slug}` : '/categories'
  
  console.log('[useCategories] Hook called with:', { slug, endpoint })
  
  const { data, error, isLoading, mutate } = useSWR<Category | Category[]>(
    endpoint,
    (url) => {
      try {
        return apiClient.get(url)
      } catch (error) {
        console.log('[useCategories] Falling back to apiFetch')
        return apiFetch(url)
      }
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1 minute
      onError: (error) => {
        console.error('[useCategories] SWR Error:', error)
      },
      onSuccess: (data) => {
        console.log('[useCategories] SWR Success:', data)
      }
    }
  )

  console.log('[useCategories] SWR state:', { data, error, isLoading })

  if (slug) {
    return {
      category: data as Category,
      isLoading,
      error,
      mutate,
    }
  }

  return {
    categories: data as Category[],
    isLoading,
    error,
    mutate,
  }
}