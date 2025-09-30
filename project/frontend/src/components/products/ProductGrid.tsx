import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/types/api'
import { Star, ExternalLink } from 'lucide-react'

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <Link
          key={product._id}
          href={`/products/${product._id}`}
          className="card hover:shadow-lg transition-all duration-200 group animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="aspect-[3/4] relative overflow-hidden">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-sm">No Image</span>
              </div>
            )}
          </div>
          
          <div className="p-4 space-y-2">
            <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
              {product.title}
            </h3>
            
            {product.author && (
              <p className="text-sm text-gray-600">by {product.author}</p>
            )}
            
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg text-primary-600">
                {product.currency === 'GBP' ? '£' : '$'}{product.price.toFixed(2)}
              </span>
              
              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
            </div>
            
            <p className="text-xs text-gray-500">
              Updated: {new Date(product.lastScrapedAt).toLocaleDateString()}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}