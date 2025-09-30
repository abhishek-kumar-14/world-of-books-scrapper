import useSWR from 'swr'
import { apiClient } from '@/lib/api'
import type { Product, ProductDetail, Review } from '@/types/api'

interface ProductWithDetails {
  product: Product
  productDetail?: ProductDetail
  reviews: Review[]
}

export function useProduct(productId: string) {
  console.log('[useProduct] Hook called with productId:', productId)
  
  const { data, error, isLoading, mutate } = useSWR<ProductWithDetails>(
    productId ? `/products/${productId}` : null,
    (url) => {
      console.log('[useProduct] Making API call to:', url)
      return apiClient.get(url)
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1 minute
      onError: (error) => {
        console.error('[useProduct] SWR Error:', error)
      },
      onSuccess: (data) => {
        console.log('[useProduct] SWR Success:', data)
      }
    }
  )

  console.log('[useProduct] SWR state:', { data, error, isLoading })

  return {
    product: data?.product,
    productDetail: data?.productDetail,
    reviews: data?.reviews,
    isLoading,
    error,
    mutate,
  }
}