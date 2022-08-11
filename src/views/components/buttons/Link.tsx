import React from 'react'
import { DocumentDownloadIcon, ExternalLinkIcon } from '@heroicons/react/outline'

type LinkProps = React.LinkHTMLAttributes<HTMLAnchorElement> & {
  disabled?: boolean
  type?: 'download' | 'target' | 'none'
}

export const Link = ({ disabled, children, type = 'none', ...props }: LinkProps) => {
  const classes = `
  inline-flex items-center text-base focus:outline-none focus:ring-2 focus:ring-offset-2
    ${disabled && 'disabled:text-slate-500 text-gray-400 pointer-events-none'}
    ${props.className || ''}
  `

  function displayIcon() {
    switch (type) {
      case 'download':
        return <DocumentDownloadIcon className="w-5 h-5 ml-1" />
      case 'target':
        return <ExternalLinkIcon className="w-5 h-5 ml-1" />
      case 'none':
      default:
        return null
    }
  }

  return (
    <a className={classes} {...props}>
      {children}
      {displayIcon()}
    </a>
  )
}
