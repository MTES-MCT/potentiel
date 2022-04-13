import React from 'react'

type ButtonProps = {
  type: 'button' | 'submit' | 'reset' | undefined
  className?: string
  children?: React.ReactNode
  primary?: true
}

export const Button = ({ type, className, children, primary }: ButtonProps) => (
  <button
    className={`inline-flex items-center px-6 py-2 border border-solid text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
      primary
        ? 'border-transparent text-white bg-blue-france-sun-base hover:bg-blue-france-sun-hover focus:bg-blue-france-sun-active'
        : 'border-blue-france-sun-base text-blue-france-sun-base bg-white hover:bg-blue-france-975-base focus:bg-blue-france-975-base'
    } ${className}`}
    style={{ color: primary ? 'white' : '#000091', textDecoration: 'none' }}
    type={type}
  >
    {children}
  </button>
)
