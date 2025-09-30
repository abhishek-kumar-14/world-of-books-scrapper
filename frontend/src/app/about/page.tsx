import { Book, Globe, Shield, Zap } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About Product Explorer
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your gateway to discovering amazing books from World of Books with 
            real-time data and comprehensive product information.
          </p>
        </div>

        {/* Mission */}
        <div className="card p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            Product Explorer is designed to provide book enthusiasts with a seamless 
            way to discover, explore, and learn about books available on World of Books. 
            We believe in making book discovery intuitive, comprehensive, and enjoyable 
            for readers of all kinds.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="card p-6">
            <div className="flex items-center mb-4">
              <Book className="h-8 w-8 text-primary-600 mr-3" />
              <h3 className="text-xl font-semibold">Comprehensive Catalog</h3>
            </div>
            <p className="text-gray-600">
              Browse through thousands of books with detailed information including 
              descriptions, reviews, ratings, and metadata.
            </p>
          </div>

          <div className="card p-6">
            <div className="flex items-center mb-4">
              <Zap className="h-8 w-8 text-primary-600 mr-3" />
              <h3 className="text-xl font-semibold">Real-time Data</h3>
            </div>
            <p className="text-gray-600">
              Get the latest product information with our intelligent scraping 
              system that keeps data fresh and accurate.
            </p>
          </div>

          <div className="card p-6">
            <div className="flex items-center mb-4">
              <Globe className="h-8 w-8 text-primary-600 mr-3" />
              <h3 className="text-xl font-semibold">Easy Navigation</h3>
            </div>
            <p className="text-gray-600">
              Intuitive category browsing and powerful search functionality 
              make finding your next great read effortless.
            </p>
          </div>

          <div className="card p-6">
            <div className="flex items-center mb-4">
              <Shield className="h-8 w-8 text-primary-600 mr-3" />
              <h3 className="text-xl font-semibold">Ethical Approach</h3>
            </div>
            <p className="text-gray-600">
              We respect website terms of service and implement responsible 
              scraping practices with proper rate limiting and caching.
            </p>
          </div>
        </div>

        {/* Technology */}
        <div className="card p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-6">Built with Modern Technology</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Frontend</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Next.js 14 with App Router</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>SWR for data fetching</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Backend</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>NestJS with TypeScript</li>
                <li>MongoDB with Mongoose</li>
                <li>Bull Queue for jobs</li>
                <li>OpenAPI documentation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Scraping</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Crawlee framework</li>
                <li>Playwright browser automation</li>
                <li>Intelligent caching</li>
                <li>Rate limiting & retries</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-6">
            Have questions, suggestions, or feedback? We'd love to hear from you!
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              This is a demonstration project showcasing modern web scraping 
              and full-stack development techniques.
            </p>
            <p className="text-sm text-gray-500">
              Built with ❤️ for the developer community
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}