'use client'
import { useState, FormEvent } from 'react'

interface Props { 
  defaultValue?: string
  onSearch: (q: string) => void
  placeholder?: string
}

export function SearchBar({ defaultValue = '', onSearch, placeholder = "Search books..." }: Props) {
  const [query, setQuery] = useState(defaultValue)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (q.length >= 2) {
      onSearch(q)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input 
        value={query} 
        onChange={e => setQuery(e.target.value)} 
        placeholder={placeholder}
        className="flex-1 border px-3 py-2"
      />
      <button 
        type="submit" 
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Search
      </button>
    </form>
  )
}
