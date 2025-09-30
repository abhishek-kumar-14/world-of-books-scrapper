'use client'

import { useState, useEffect } from 'react'
import { useCategories } from '@/hooks/useCategories'
import { useProducts } from '@/hooks/useProducts'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { ProductGrid } from '@/components/products/ProductGrid'
import { ChevronRight, Package, RefreshCw, Plus } from 'lucide-react'

interface CategoryPageProps {
  slug: string
  page: number
  limit: number
}

export function CategoryPage({ slug }: CategoryPageProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isScraping, setIsScraping] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [scrapingStatus, setScrapingStatus] = useState<string>('')
  const [loadMoreCount, setLoadMoreCount] = useState(0)
  
  const { category, isLoading: categoryLoading, error: categoryError, mutate: mutateCategory } = useCategories(slug)
  const { products, isLoading: productsLoading, error: productsError, mutate: mutateProducts } = useProducts({
    categorySlug: slug,
    limit: 100
  })

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await mutateProducts(undefined, { revalidate: true })
      await mutateCategory(undefined, { revalidate: true })
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleScrapeCategory = async (loadMoreClicks = 0) => {
    setIsScraping(true)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      const endpoint = `${apiUrl}/scraping/category/${encodeURIComponent(slug)}`

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loadMoreClicks })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      // Poll until products appear
      let attempts = 0
      const maxAttempts = 20

      const pollForCompletion = async () => {
        attempts++
        
        try {
          await mutateProducts()

          const freshResponse = await fetch(`${apiUrl}/products?categorySlug=${encodeURIComponent(slug)}&limit=100`)
          const freshData = await freshResponse.json()
          const productCount = freshData?.data?.length || 0

          if (productCount > 0) {
            setTimeout(() => setScrapingStatus(''), 3000)
            setIsScraping(false)
            return
          }

          if (attempts < maxAttempts) {
            setTimeout(pollForCompletion, 3000)
          } else {
            setTimeout(() => setScrapingStatus(''), 5000)
            setIsScraping(false)
          }
        } catch (error) {
          setTimeout(() => setScrapingStatus(''), 3000)
          setIsScraping(false)
        }
      }

      setTimeout(pollForCompletion, 5000)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      setTimeout(() => setScrapingStatus(''), 3000)
      setIsScraping(false)
    }
  }

  const handleLoadMore = async () => {
    setIsLoadingMore(true)
    const nextLoadMoreCount = loadMoreCount + 1
    setScrapingStatus(`🔄 Clicking "Load More" button ${nextLoadMoreCount} time${nextLoadMoreCount > 1 ? 's' : ''}...`)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      const endpoint = `${apiUrl}/scraping/category/${encodeURIComponent(slug)}`

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loadMoreClicks: nextLoadMoreCount })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      setScrapingStatus('⏳ Scraping more products... (this may take 60-90 seconds)')

      let attempts = 0
      const maxAttempts = 30
      const currentProductCount = products?.length || 0

      const pollForNewProducts = async () => {
        attempts++
        setScrapingStatus(`🔍 Checking for new products... (${attempts}/${maxAttempts})`)

        try {
          await mutateProducts()

          const response = await fetch(`${apiUrl}/products?categorySlug=${encodeURIComponent(slug)}&limit=100`)
          const freshData = await response.json()
          const newProductCount = freshData?.data?.length || 0

          if (newProductCount > currentProductCount) {
            const newBooks = newProductCount - currentProductCount
            setScrapingStatus(`✅ Success! Found ${newBooks} new book${newBooks > 1 ? 's' : ''}`)
            setLoadMoreCount(nextLoadMoreCount)
            setTimeout(() => setScrapingStatus(''), 5000)
            return
          }

          if (attempts < maxAttempts) {
            setTimeout(pollForNewProducts, 5000)
          } else {
            setScrapingStatus('⏰ Loading took too long. Try refreshing.')
            setLoadMoreCount(nextLoadMoreCount)
            setTimeout(() => setScrapingStatus(''), 5000)
          }
        } catch (error) {
          setScrapingStatus('❌ Error loading more products. Please try again.')
          setTimeout(() => setScrapingStatus(''), 3000)
        }
      }

      setTimeout(pollForNewProducts, 10000)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      setScrapingStatus(`❌ Failed to load more products: ${errorMessage}`)
      setTimeout(() => setScrapingStatus(''), 3000)
    } finally {
      // ✅ Force spinner to show for at least 5s
      setTimeout(() => {
        setIsLoadingMore(false)
      }, 10000)
    }
  }

  const totalProducts = products?.length || 0
  const hasProducts = totalProducts > 0

  useEffect(() => {
    if (!productsLoading && !productsError && !isScraping && (!products || products.length === 0)) {
      handleScrapeCategory()
    }
  }, [products, productsLoading, productsError])

  if (categoryLoading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-64"></div>
        <div className="skeleton h-4 w-96"></div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card p-4 space-y-3">
              <div className="skeleton h-48 w-full"></div>
              <div className="skeleton h-4 w-3/4"></div>
              <div className="skeleton h-4 w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (categoryError) {
    return (
      <ErrorMessage 
        message="Failed to load category" 
        onRetry={() => mutateCategory()}
      />
    )
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600">
        <a href="/" className="hover:text-primary-600">Home</a>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 font-medium">{category?.title || slug}</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {category?.title || slug}
          </h1>
          <p className="text-gray-600">
            {totalProducts} products found
          </p>
          {scrapingStatus && (
            <p className="text-sm text-blue-600 mt-2">{scrapingStatus}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="btn-secondary inline-flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Products */}
      {productsLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : productsError ? (
        <ErrorMessage 
          message="Failed to load products" 
          onRetry={() => mutateProducts()}
        />
      ) : !products?.length ? (
        <div className="text-center py-12">
          {isScraping ? (
            <div className="flex flex-col items-center space-y-4">
              <LoadingSpinner size="lg" />
              <p className="mt-2 text-gray-600">
                Scraping products for "{category?.title || slug}"... Please wait.
              </p>
            </div>
          ) : (
            <>
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Found</h3>
              <p className="text-gray-600">
                No products available for this category yet.
              </p>
            </>
          )}
        </div>
      ) : (
        <>
          <ProductGrid products={products} />

          {hasProducts && (
            <div className="text-center py-8">
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-3"
              >
                {isLoadingMore ? (
                  <>
                    <LoadingSpinner className="w-5 h-5" />
                    <span>Loading More...</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5" />
                    <span>Load More Books</span>
                  </>
                )}
              </button>
              <p className="text-sm text-gray-500 mt-2">
                Showing {totalProducts} books
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
