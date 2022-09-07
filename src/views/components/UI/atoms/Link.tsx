import React, { ComponentProps, FC } from 'react'

type LinkProps = ComponentProps<'a'>

export const Link: FC<LinkProps> = ({ className = '', children, ...props }) => (
  <a
    className={`text-blue-france-sun-base underline hover:text-blue-france-sun-base hover:underline focus:text-blue-france-sun-base focus:underline 
                ${className}`}
    style={{ color: '#000091' }} // Style permettant de surcharger les styles css legacy appliqué sur l'élément a
    {...props}
  >
    {children}
  </a>
)
