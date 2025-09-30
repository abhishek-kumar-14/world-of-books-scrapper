// Navigation types
export interface Navigation {
  _id: string
  title: string
  slug: string
  lastScrapedAt: string
  createdAt: string
  updatedAt: string
}

// Category types
export interface Category {
  _id: string
  navigationId: string
  parentId?: string
  title: string
  slug: string
  productCount: number
  lastScrapedAt: string
  createdAt: string
  updatedAt: string
}

// Product types
export interface Product {
  _id: string
  sourceId: string
  title: string
  author?: string
  price: number
  currency: string
  imageUrl?: string
  sourceUrl: string
  lastScrapedAt: string
  createdAt: string
  updatedAt: string
}

export interface ProductDetail {
  productId: string
  description?: string
  specs?: Record<string, any>
  ratingsAvg?: number
  reviewsCount?: number
  publisher?: string
  publicationDate?: string
  isbn?: string
  createdAt: string
  updatedAt: string
}

export interface Review {
  _id: string
  productId: string
  author: string
  rating: number
  text: string
  createdAt: string
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface SearchResponse {
  data: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  query: string
  filters?: {
    minPrice?: number
    maxPrice?: number
    author?: string
    minRating?: number
  }
}

// Scraping types
export interface ScrapeJob {
  _id: string
  targetUrl: string
  targetType: string
  status: string
  startedAt?: string
  finishedAt?: string
  errorLog?: string
  createdAt: string
  updatedAt: string
}