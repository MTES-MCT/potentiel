import React from 'react'
import {
  DocumentDownloadIcon,
  ExternalLinkIcon,
  MailIcon,
  PhoneIcon,
} from '@heroicons/react/outline'
import { isLinkMailTo, isLinkPhoneCall } from './helpers'

interface LinkProps extends React.ComponentProps<'a'> {
  disabled?: boolean
}

export const Link: React.FunctionComponent<LinkProps> = ({
  disabled,
  children,
  type = 'none',
  className = '',
  ...props
}) => {
  const classes = `
  inline-flex items-center text-base focus:outline-none focus:ring-2 focus:ring-offset-2
    ${disabled && 'disabled:text-slate-500 text-gray-400 pointer-events-none'}
    ${className}
  `

  return (
    <a className={classes} {...props}>
      {children}
      {props.download && <DocumentDownloadIcon className="w-5 h-5 ml-1" />}
      {props.target && props.target === '_blank' && <ExternalLinkIcon className="w-5 h-5 ml-1" />}
      {isLinkMailTo(props.href) && <MailIcon className="w-5 h-5 ml-1" />}
      {isLinkPhoneCall(props.href) && <PhoneIcon className="w-5 h-5 ml-1" />}
    </a>
  )
}
