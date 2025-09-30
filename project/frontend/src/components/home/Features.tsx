import { Search, Zap, Shield, Globe, Star, BookOpen } from 'lucide-react'

const features = [
  {
    icon: Search,
    title: 'Powerful Search',
    description: 'Find books by title, author, or keywords with our intelligent search engine.',
  },
  {
    icon: Zap,
    title: 'Real-time Data',
    description: 'Get the latest product information with automatic updates and fresh content.',
  },
  {
    icon: Shield,
    title: 'Ethical Scraping',
    description: 'Responsible data collection that respects website terms and implements proper rate limiting.',
  },
  {
    icon: Globe,
    title: 'Easy Navigation',
    description: 'Browse through categories and subcategories with intuitive navigation.',
  },
  {
    icon: Star,
    title: 'Reviews & Ratings',
    description: 'Access customer reviews and ratings to make informed purchasing decisions.',
  },
  {
    icon: BookOpen,
    title: 'Detailed Information',
    description: 'Comprehensive product details including descriptions, specifications, and metadata.',
  },
]

export function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Product Explorer?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Built with modern technology and best practices to provide you with 
            the best book discovery experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="card p-6 hover:shadow-lg transition-all duration-200 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center mb-4">
                <div className="p-2 bg-primary-100 rounded-lg mr-4">
                  <feature.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}