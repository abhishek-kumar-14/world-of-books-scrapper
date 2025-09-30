import { CategoryPage } from '@/components/categories/CategoryPage'

interface CategoryPageProps {
  params: { slug: string }
}

export default async function Category({ params }: CategoryPageProps) {
  console.log('[Category Page] Rendering with slug:', params.slug)

  return (
    <div className="container mx-auto px-4 py-8">
      <CategoryPage 
        slug={params.slug} 
        page={1} 
        limit={100} 
      />
    </div>
  )
}