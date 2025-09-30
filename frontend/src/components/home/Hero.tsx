import Link from 'next/link'
import { Search, BookOpen, TrendingUp } from 'lucide-react'

export function Hero() {
  return (
    <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 text-balance">
            Discover Amazing Books from{' '}
            <span className="text-primary-600">World of Books</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto text-balance">
            Explore thousands of books with real-time data, comprehensive details, 
            and intelligent search. Your next great read is just a click away.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/search" className="btn-primary text-lg px-8 py-3">
              <Search className="h-5 w-5 mr-2" />
              Start Exploring
            </Link>
            <Link href="/about" className="btn-secondary text-lg px-8 py-3">
              <BookOpen className="h-5 w-5 mr-2" />
              Learn More
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">1000+</div>
              <div className="text-gray-600">Books Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">50+</div>
              <div className="text-gray-600">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">24/7</div>
              <div className="text-gray-600">Real-time Updates</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}