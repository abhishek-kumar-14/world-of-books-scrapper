'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSearch } from '@/hooks/useSearch'
import { SearchBar } from '@/components/search/SearchBar'
import { ProductGrid } from '@/components/products/ProductGrid'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { Pagination } from '@/components/ui/Pagination'
import { Search, Package, ListFilter as Filter, X } from 'lucide-react'

interface SearchPageProps {
  query: string
  page: number
  limit: number
}

export function SearchPage({ query, page, limit }: SearchPageProps) {
  const [isSearching, setIsSearching] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    author: '',
    minRating: ''
  })
  
  const router = useRouter()
  const { results, pagination, isLoading, error, mutate } = useSearch({ 
    query, 
    page, 
    limit,
    minPrice: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
    author: filters.author || undefined,
    minRating: filters.minRating ? parseFloat(filters.minRating) : undefined
  })

  // ✅ Trigger scraping
  useEffect(() => {
    if (query && query.trim() && !isLoading && !error) {
      setIsSearching(true)

      let attempts = 0
      const maxAttempts = 20

      const pollForResults = async () => {
        attempts++
        try {
          await mutate() // refresh results

          if (results?.length && results.length > 0) {
            setIsSearching(false) // ✅ stop searching when results found
            return
          }

          if (attempts < maxAttempts) {
            setTimeout(pollForResults, 3000)
          } else {
            setIsSearching(false) // ✅ stop after timeout
          }
        } catch (error) {
          console.error("Error polling for search results:", error)
          setIsSearching(false)
        }
      }

      setTimeout(pollForResults, 2000)
    }
  }, [query, isLoading, error, mutate, results])

  const handleSearch = (newQuery: string) => {
    const params = new URLSearchParams()
    if (newQuery.trim()) params.append('q', newQuery.trim())
    if (filters.minPrice) params.append('minPrice', filters.minPrice)
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)
    if (filters.author) params.append('author', filters.author)
    if (filters.minRating) params.append('minRating', filters.minRating)
    
    setIsSearching(false)
    
    router.replace(`/search?${params.toString()}`, { scroll: false })
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      author: '',
      minRating: ''
    })
    router.push(`/search${query ? `?q=${encodeURIComponent(query)}` : ''}`, { scroll: false })
  }

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center space-x-3">
          <Search className="h-8 w-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Search Products</h1>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <SearchBar 
            defaultValue={query}
            onSearch={handleSearch}
            placeholder="Search for books, authors, or keywords..."
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary inline-flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>

        {showFilters && (
          <div className="card p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Search Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center space-x-1"
              >
                <X className="h-4 w-4" />
                <span>Clear All</span>
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Price (£)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (£)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="100.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <input
                  type="text"
                  value={filters.author}
                  onChange={(e) => handleFilterChange('author', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Author name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Rating</label>
                <select
                  value={filters.minRating}
                  onChange={(e) => handleFilterChange('minRating', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Any Rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                  <option value="1">1+ Stars</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search Results */}
      {(query || Object.values(filters).some(f => f)) && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {query ? `Search Results for "${query}"` : 'Filtered Results'}
            </h2>
            {pagination && (
              <p className="text-gray-600">{pagination.total} results found</p>
            )}
          </div>

          {(isLoading || isSearching) ? (
            <div className="flex justify-center py-12">
              <div className="flex items-center space-x-4">
                <LoadingSpinner size="lg"/>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Searching for "{query}"...
                  </h3>
                  <p className="text-gray-600">Fetching fresh results, please wait.</p>
                </div>
              </div>
            </div>
          ) : error ? (
            <ErrorMessage 
              message="Failed to search products" 
              onRetry={() => mutate()}
            />
          ) : !results?.length ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h3>
              <p className="text-gray-600">Try different keywords or check your spelling</p>
            </div>
          ) : (
            <>
              <ProductGrid products={results} />
              {pagination && pagination.pages > 1 && (
                <Pagination 
                  currentPage={pagination.page}
                  totalPages={pagination.pages}
                  baseUrl={`/search?q=${encodeURIComponent(query || '')}`}
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
