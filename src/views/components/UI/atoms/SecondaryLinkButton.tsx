import React, { ComponentProps, FC } from 'react'

type LinkButtonProps = ComponentProps<'a'>

export const SecondaryLinkButton: FC<LinkButtonProps> = ({
  children,
  className = '',
  ...props
}) => (
  <a
    className={` 
    no-underline inline-flex items-center px-6 py-2 font-medium shadow-sm border border-solid border-blue-france-sun-base bg-white text-base text-blue-france-sun-base
     hover:text-blue-france-sun-base hover:bg-blue-france-975-base focus:outline-none focus:ring-2 focus:ring-offset-2 focus:text-blue-france-sun-base focus:bg-blue-france-975-base active:text-blue-france-sun-base
    ${className}`}
    style={{ color: '#000091' }}
    {...props}
  >
    {children}
  </a>
)
