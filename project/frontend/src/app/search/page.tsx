import { SearchPage } from '@/components/search/SearchPage'

interface SearchPageProps {
  searchParams: { q?: string; page?: string; limit?: string }
}

export default function Search({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ''
  const page = parseInt(searchParams.page || '1', 10)
  const limit = parseInt(searchParams.limit || '20', 10)

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchPage 
        query={query} 
        page={page} 
        limit={limit} 
      />
    </div>
  )
}