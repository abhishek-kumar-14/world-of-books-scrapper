import Link from 'next/link'
import { Book, Github, ExternalLink } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Book className="h-8 w-8 text-primary-400" />
              <span className="text-xl font-bold">Product Explorer</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Discover amazing books from World of Books with our comprehensive 
              product catalog and real-time data updates.
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://www.worldofbooks.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors flex items-center space-x-1"
              >
                <span className="text-sm">World of Books</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-gray-400 hover:text-white transition-colors">
                  Search
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href={`${process.env.NEXT_PUBLIC_API_URL}/api/docs`}  
                  target="_blank"
                  className="text-gray-400 hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>API Documentation</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <span className="text-gray-400">Status: Operational</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Product Explorer. Built for educational purposes.
          </p>
          <p className="text-gray-400 text-sm mt-2 md:mt-0">
            Data sourced from World of Books
          </p>
        </div>
      </div>
    </footer>
  )
}