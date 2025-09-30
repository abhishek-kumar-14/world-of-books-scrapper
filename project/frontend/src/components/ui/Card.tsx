import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div className={`card ${hover ? 'hover:shadow-lg transition-shadow duration-200' : ''} ${className}`}>
      {children}
    </div>
  )
}