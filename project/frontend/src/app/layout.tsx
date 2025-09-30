import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Product Explorer - World of Books',
  description: 'Explore and discover books from World of Books with our comprehensive product catalog',
  keywords: 'books, world of books, product explorer, book catalog, online books',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      
    <nav className="border-b">
      <div className="max-w-5xl mx-auto flex gap-4 p-4 text-sm">
        <a href="/" className="font-semibold">Home</a>
        <a href="/about">About</a>
        <a href="/search">Search</a>
        <a href="/contact">Contact</a>
        <a href="/readme">README</a>
        <a href="/tos">Terms</a>
        <a href={`${process.env.NEXT_PUBLIC_API_URL}/api/docs`} target="_blank" rel="noreferrer">API Docs</a>
      </div>
    </nav>
    
</body>
    </html>
  )
}