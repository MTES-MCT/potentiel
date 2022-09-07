import React, { ComponentProps } from 'react'

export type CalloutProps = ComponentProps<'div'>

export const Callout = ({ children, className = '', ...props }: CalloutProps) => {
  return (
    <div
      {...props}
      className={`px-12 py-8 border-solid border-0 border-l-4 border-blue-france-main-525-base bg-white ${className}`}
    >
      {children}
    </div>
  )
}
