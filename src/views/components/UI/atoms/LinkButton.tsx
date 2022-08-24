import React, { ComponentProps, FC } from 'react'

type LinkButtonProps = ComponentProps<'a'>

export const LinkButton: FC<LinkButtonProps> = ({ children, className = '', ...props }) => (
  <a
    className={`no-underline inline-flex items-center px-6 py-2 border border-solid text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 border-transparent bg-blue-france-sun-base hover:bg-blue-france-sun-hover focus:bg-blue-france-sun-active text-white
    ${className}`}
    style={{ color: '#ffffff' }}
    {...props}
  >
    {children}
  </a>
)
