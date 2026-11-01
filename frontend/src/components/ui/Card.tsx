import type { ComponentPropsWithoutRef } from 'react'
import './Card.css'

export function Card({
  className = '',
  children,
  ...props
}: ComponentPropsWithoutRef<'section'>) {
  return (
    <section {...props} className={`card ${className}`.trim()}>
      {children}
    </section>
  )
}