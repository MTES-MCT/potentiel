import React from 'react'

type ButtonProps = React.HTMLAttributes<HTMLButtonElement> & {
  type?: 'button' | 'submit' | 'reset'
  primary?: true
  disabled?: boolean
}

export const Button = ({
  className = '',
  children,
  disabled = false,
  primary,
  ...props
}: ButtonProps) => {
  const buttonClassNames = `inline-flex items-center px-6 py-2 border border-solid text-base text-decoration-none font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2
    ${
      primary
        ? 'border-transparent text-white bg-blue-france-sun-base hover:bg-blue-france-sun-hover focus:bg-blue-france-sun-active text-white'
        : 'border-blue-france-sun-base text-blue-france-sun-base bg-white hover:bg-blue-france-975-base focus:bg-blue-france-975-base text-blue-france-sun-base'
    } 
    ${
      disabled &&
      'disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none'
    } 
    ${className}
  `

  return (
    <button className={buttonClassNames} {...props}>
      {children || 'Button'}
    </button>
  )
}
