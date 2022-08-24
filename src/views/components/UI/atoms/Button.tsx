import React, { ComponentProps, FC } from 'react'

export type ButtonProps = Omit<ComponentProps<'button'>, 'disabled'>

export const Button: FC<ButtonProps> = ({ children, className = '', ...props }) => (
  <button
    className={`inline-flex items-center px-6 py-2 border border-solid text-base text-decoration-none font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2
                  border-transparent bg-blue-france-sun-base hover:bg-blue-france-sun-hover focus:bg-blue-france-sun-active text-white 
                  ${className}`}
    {...props}
  >
    {children}
  </button>
)
