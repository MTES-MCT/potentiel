import React from 'react'

type ButtonProps = {
  id?: string
  type?: 'button' | 'submit' | 'reset'
  name?: string
  className?: string
  children?: React.ReactNode
  primary?: true
  disabled?: true,
  value?: string
}

export const Button = ({ id, type, name, className = '', children, primary, disabled, value }: ButtonProps) => (
  <button
    className={`inline-flex items-center px-6 py-2 border border-solid text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
      primary
        ? 'border-transparent text-white bg-blue-france-sun-base hover:bg-blue-france-sun-hover focus:bg-blue-france-sun-active'
        : 'border-blue-france-sun-base text-blue-france-sun-base bg-white hover:bg-blue-france-975-base focus:bg-blue-france-975-base'
    } ${className}`}
    style={{ color: primary ? 'white' : '#000091', textDecoration: 'none' }}
    {...{ id, type, name, disabled, value }}
  >
    {children}
  </button>
)
