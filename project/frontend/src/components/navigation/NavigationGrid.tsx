'use client'

import Link from 'next/link'
import { useNavigation } from '@/hooks/useNavigation'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { BookOpen, RefreshCw } from 'lucide-react'
import { useState } from 'react'

export function NavigationGrid() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { navigation, isLoading, error, mutate } = useNavigation()

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await mutate()
    } finally {
      setIsRefreshing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="skeleton h-8 w-48"></div>
          <div className="skeleton h-10 w-24"></div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card p-6 space-y-3">
              <div className="skeleton h-8 w-8"></div>
              <div className="skeleton h-6 w-3/4"></div>
              <div className="skeleton h-4 w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <ErrorMessage 
        message="Failed to load navigation categories" 
        onRetry={() => mutate()}
      />
    )
  }

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Browse Categories
          </h2>
          <p className="text-gray-600">
            Discover books organized by category from World of Books
          </p>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="btn-secondary inline-flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {!navigation?.length ? (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Categories Found</h3>
          <p className="text-gray-600 mb-4">
            Categories will appear here once data is scraped from World of Books
          </p>
          <button onClick={handleRefresh} className="btn-primary">
            Load Categories
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {navigation.map((item, index) => (
            <Link
              key={item._id}
              href={`/categories/${item.slug}`}
              className="card p-6 hover:shadow-lg transition-all duration-200 group animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center mb-4">
                <div className="p-2 bg-primary-100 rounded-lg mr-3 group-hover:bg-primary-200 transition-colors">
                  <BookOpen className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {item.title}
                </h3>
              </div>
              
              <p className="text-sm text-gray-500">
                Last updated: {new Date(item.lastScrapedAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}