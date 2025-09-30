import { Hero } from '@/components/home/Hero'
import { Features } from '@/components/home/Features'
import { NavigationGrid } from '@/components/navigation/NavigationGrid'

export default function HomePage() {
  return (
    <div className="space-y-16">
      <Hero />
      <div className="container mx-auto px-4">
        <NavigationGrid />
      </div>
      <Features />
    </div>
  )
}