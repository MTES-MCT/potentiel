import React from 'react'

type AstérisqueProps = React.HTMLAttributes<HTMLSpanElement> & {
  className?: string
}

export const Astérisque = ({ className = '' }: AstérisqueProps) => (
  <span className={`text-red-500 ${className}`}>*</span>
)
