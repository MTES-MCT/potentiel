import React, { ComponentProps, FC } from 'react'

type LinkButtonProps = ComponentProps<'a'>

export const LinkButton: FC<LinkButtonProps> = ({ children, className = '', ...props }) => (
  <a
    className={`text-white no-underline inline-flex items-center px-6 py-2 border border-solid text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 border-transparent bg-blue-france-sun-base hover:bg-blue-france-sun-hover focus:bg-blue-france-sun-active
    ${className}`}
    style={{ color: '#ffffff', textDecoration: 'none' }} // Style permettant de surcharger les styles css legacy appliqué sur l'élément a
    {...props}
  >
    {children}
  </a>
)
