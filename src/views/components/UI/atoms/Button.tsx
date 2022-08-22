import React from 'react'

interface ButtonProps extends React.ComponentProps<'button'> {
  type?: 'button' | 'submit' | 'reset'
  primary?: true
  disabled?: boolean
  name?: string
  value?: string
}

export const Button: React.FunctionComponent<ButtonProps> = ({
  children,
  disabled = false,
  primary,
  className,
  ...props
}) => {
  const buttonClassNames = `inline-flex items-center px-6 py-2 border border-solid text-base text-decoration-none font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2
    ${
      primary
        ? 'border-transparent bg-blue-france-sun-base hover:bg-blue-france-sun-hover focus:bg-blue-france-sun-active text-white'
        : 'border-blue-france-sun-base text-blue-france-sun-base bg-white hover:bg-blue-france-975-base focus:bg-blue-france-975-base text-blue-france-sun-base'
    }
    ${
      !disabled
        ? ''
        : primary
        ? 'border-transparent bg-neutral-200 text-neutral-500 shadow-none pointer-events-none'
        : 'border-neutral-200 text-neutral-500 shadow-none pointer-events-none'
    } 
    ${className || ''}
  `

  return (
    <button className={buttonClassNames} disabled={disabled} {...props}>
      {children || 'Bouton'}
    </button>
  )
}
