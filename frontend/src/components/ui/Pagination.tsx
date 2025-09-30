import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  const getPageUrl = (page: number) => {
    // Remove existing page parameter and add new one
    const url = new URL(baseUrl, window.location.origin)
    url.searchParams.set('page', page.toString())
    return url.pathname + url.search
  }

  const renderPageNumbers = () => {
    const pages = []
    const showPages = 5
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2))
    let endPage = Math.min(totalPages, startPage + showPages - 1)

    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(1, endPage - showPages + 1)
    }

    // First page
    if (startPage > 1) {
      pages.push(
        <Link
          key={1}
          href={getPageUrl(1)}
          className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
        >
          1
        </Link>
      )
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis1" className="px-3 py-2 text-sm text-gray-400">
            ...
          </span>
        )
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Link
          key={i}
          href={getPageUrl(i)}
          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            i === currentPage
              ? 'bg-primary-600 text-white'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          {i}
        </Link>
      )
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis2" className="px-3 py-2 text-sm text-gray-400">
            ...
          </span>
        )
      }
      pages.push(
        <Link
          key={totalPages}
          href={getPageUrl(totalPages)}
          className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
        >
          {totalPages}
        </Link>
      )
    }

    return pages
  }

  if (totalPages <= 1) return null

  return (
    <nav className="flex items-center justify-center space-x-1">
      {/* Previous button */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Link>
      ) : (
        <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-300 cursor-not-allowed rounded-md">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </span>
      )}

      {/* Page numbers */}
      <div className="flex items-center space-x-1">
        {renderPageNumbers()}
      </div>

      {/* Next button */}
      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      ) : (
        <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-300 cursor-not-allowed rounded-md">
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </span>
      )}
    </nav>
  )
}