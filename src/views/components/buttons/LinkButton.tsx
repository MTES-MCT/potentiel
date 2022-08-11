import React from 'react'
import {
  DocumentDownloadIcon,
  ExternalLinkIcon,
  MailIcon,
  PhoneIcon,
} from '@heroicons/react/outline'
import { isLinkMailTo, isLinkPhoneCall } from './helpers'

type LinkButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  primary?: true
  disabled?: boolean
}

export const LinkButton = ({ disabled, primary, children, ...props }: LinkButtonProps) => {
  const classes = `inline-flex items-center px-6 py-2 border border-solid text-base no-underline font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2
    ${
      primary
        ? 'border-transparent bg-blue-france-sun-base hover:bg-blue-france-sun-hover focus:bg-blue-france-sun-active text-white hover:text-white focus:text-white'
        : 'border-blue-france-sun-base text-blue-france-sun-base bg-white hover:bg-blue-france-975-base focus:bg-blue-france-975-base hover:text-blue-france-sun-base focus:text-blue-france-sun-base'
    }
    ${
      !disabled
        ? ''
        : primary
        ? 'border-transparent bg-neutral-200 text-neutral-500 shadow-none pointer-events-none'
        : 'border-neutral-200 text-neutral-500 shadow-none pointer-events-none'
    } 
    ${props.className || ''}
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
