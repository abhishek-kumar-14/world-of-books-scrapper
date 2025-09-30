import { ProductDetailPage } from '@/components/products/ProductDetailPage'

interface ProductPageProps {
  params: { id: string }
}

export default function Product({ params }: ProductPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetailPage productId={params.id} />
    </div>
  )
}