'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useProduct } from '@/hooks/useProduct'
import { useRecommendations } from '@/hooks/useRecommendations'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { Badge } from '@/components/ui/Badge'
import { ProductGrid } from '@/components/products/ProductGrid'
import { Star, ExternalLink, RefreshCw, Package, MessageCircle } from 'lucide-react'

interface ProductDetailPageProps {
  productId: string
}

export function ProductDetailPage({ productId }: ProductDetailPageProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  console.log('[ProductDetailPage] Component rendered with productId:', productId)
  
  const { product, productDetail, reviews, isLoading, error, mutate } = useProduct(productId)

  // Get recommendations for this product
  const { recommendations, isLoading: recommendationsLoading } = useRecommendations(productId, 4)

  console.log('[ProductDetailPage] Hook data:', { product, productDetail, reviews, isLoading, error })

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await mutate()
    } finally {
      setIsRefreshing(false)
    }
  }

  if (isLoading) {
    console.log('[ProductDetailPage] Showing loading state')
    return (
      <div className="space-y-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="skeleton h-96 w-full"></div>
          <div className="space-y-4">
            <div className="skeleton h-8 w-3/4"></div>
            <div className="skeleton h-4 w-1/2"></div>
            <div className="skeleton h-6 w-1/4"></div>
            <div className="skeleton h-20 w-full"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    console.error('[ProductDetailPage] Showing error state:', error)
    return (
      <ErrorMessage 
        message={`Failed to load product details: ${error.message || 'Unknown error'}`}
        onRetry={() => mutate()}
      />
    )
  }

  if (!product) {
    console.log('[ProductDetailPage] No product found')
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Not Found</h3>
        <p className="text-gray-600">The product you're looking for doesn't exist</p>
      </div>
    )
  }

  console.log('[ProductDetailPage] Rendering product:', product.title)

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <div className="space-y-8">
      {/* Product Header */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="aspect-[3/4] relative overflow-hidden rounded-lg bg-gray-100">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="h-24 w-24 text-gray-400" />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
              {product.author && (
                <p className="text-lg text-gray-600">by {product.author}</p>
              )}
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

          {/* Rating */}
          {productDetail?.ratingsAvg && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {renderStars(Math.round(productDetail.ratingsAvg))}
              </div>
              <span className="text-sm text-gray-600">
                {productDetail.ratingsAvg.toFixed(1)} ({productDetail.reviewsCount || 0} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="text-3xl font-bold text-primary-600">
            {product.currency === 'GBP' ? '£' : '$'}{product.price.toFixed(2)}
          </div>

          {/* Product Details */}
          {productDetail && (
            <div className="space-y-4">
              {productDetail.publisher && (
                <div>
                  <span className="font-medium">Publisher: </span>
                  <span className="text-gray-600">{productDetail.publisher}</span>
                </div>
              )}
              
              {productDetail.isbn && (
                <div>
                  <span className="font-medium">ISBN: </span>
                  <span className="text-gray-600">{productDetail.isbn}</span>
                </div>
              )}
              
              {productDetail.publicationDate && (
                <div>
                  <span className="font-medium">Publication Date: </span>
                  <span className="text-gray-600">
                    {new Date(productDetail.publicationDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* External Link */}
          <a
            href={product.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <span>View on World of Books</span>
            <ExternalLink className="h-4 w-4" />
          </a>
          
          {/* Additional Actions */}
          <div className="flex space-x-3 pt-4">
            <button className="btn-secondary flex-1">
              Add to Wishlist
            </button>
            <button className="btn-secondary flex-1">
              Share Product
            </button>
          </div>
        </div>
      </div>

      {/* Description */}
      {productDetail?.description && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Description</h2>
          <p className="text-gray-700 leading-relaxed">{productDetail.description}</p>
        </div>
      )}
      
      {/* Product Specifications */}
      {productDetail && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Product Details</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {productDetail.publisher && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="font-medium text-gray-600">Publisher:</span>
                <span className="text-gray-900">{productDetail.publisher}</span>
              </div>
            )}
            {productDetail.isbn && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="font-medium text-gray-600">ISBN:</span>
                <span className="text-gray-900">{productDetail.isbn}</span>
              </div>
            )}
            {productDetail.publicationDate && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="font-medium text-gray-600">Publication Date:</span>
                <span className="text-gray-900">
                  {new Date(productDetail.publicationDate).toLocaleDateString()}
                </span>
              </div>
            )}
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="font-medium text-gray-600">Currency:</span>
              <span className="text-gray-900">{product.currency}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="font-medium text-gray-600">Last Updated:</span>
              <span className="text-gray-900">
                {new Date(product.lastScrapedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Reviews */}
      {reviews && reviews.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center space-x-2 mb-6">
            <MessageCircle className="h-5 w-5 text-gray-600" />
            <h2 className="text-xl font-semibold">Customer Reviews</h2>
            <Badge variant="secondary">{reviews.length}</Badge>
            {productDetail?.ratingsAvg && (
              <div className="flex items-center ml-4">
                <div className="flex items-center mr-2">
                  {renderStars(Math.round(productDetail.ratingsAvg))}
                </div>
                <span className="text-sm text-gray-600">
                  {productDetail.ratingsAvg.toFixed(1)} average
                </span>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review._id} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{review.author}</span>
                  <div className="flex items-center">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <p className="text-gray-700">{review.text}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
          
          {/* Write Review Button */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button className="btn-secondary">
              Write a Review
            </button>
          </div>
        </div>
      )}
      
      {/* Recommendations Section */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">You Might Also Like</h2>
        
        {recommendationsLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="skeleton h-48 w-full"></div>
                <div className="skeleton h-4 w-3/4"></div>
                <div className="skeleton h-4 w-1/2"></div>
              </div>
            ))}
          </div>
        ) : recommendations.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendations.map((rec, index) => (
              <Link
                key={rec._id}
                href={`/products/${rec._id}`}
                className="card hover:shadow-lg transition-all duration-200 group animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-[3/4] relative overflow-hidden">
                  {rec.imageUrl ? (
                    <Image
                      src={rec.imageUrl}
                      alt={rec.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Package className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors text-sm">
                    {rec.title}
                  </h3>
                  
                  {rec.author && (
                    <p className="text-xs text-gray-600">by {rec.author}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary-600">
                      {rec.currency === 'GBP' ? '£' : '$'}{rec.price.toFixed(2)}
                    </span>
                    <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-primary-600 transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No recommendations available</p>
            <p className="text-sm text-gray-400 mt-1">
              Try browsing our categories to discover more books
            </p>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="text-sm text-gray-500 text-center">
        Last updated: {new Date(product.lastScrapedAt).toLocaleString()}
      </div>
    </div>
  )
}