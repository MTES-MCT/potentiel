import React, { ComponentProps } from 'react'

export const Heading3 = ({ children, className = '', ...props }: ComponentProps<'h3'>) => (
  <h3 {...props} className={`text-lg font-bold text-gray-900 ${className}`}>
    {children}
  </h3>
)
