import React from 'react'
import { DocumentDownloadIcon, ExternalLinkIcon } from '@heroicons/react/outline'

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  disabled?: boolean
}

export const Link = ({ disabled, children, type = 'none', ...props }: LinkProps) => {
  const classes = `
  inline-flex items-center text-base focus:outline-none focus:ring-2 focus:ring-offset-2
    ${disabled && 'disabled:text-slate-500 text-gray-400 pointer-events-none'}
    ${props.className || ''}
  `

  return (
    <a className={classes} {...props}>
      {children}
      {props.download && <DocumentDownloadIcon className="w-5 h-5 ml-1" />}
      {props.target && props.target === '_blank' && <ExternalLinkIcon className="w-5 h-5 ml-1" />}
    </a>
  )
}
