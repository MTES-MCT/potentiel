import React, { ComponentProps, FC } from 'react'
import {
  DocumentDownloadIcon,
  ExternalLinkIcon,
  MailIcon,
  DocumentReportIcon,
} from '@heroicons/react/outline'
import { isLinkMailTo } from './helpers'

type LinkButtonProps = ComponentProps<'a'> & {
  primary?: true
  excel?: boolean
}

export const LinkButton: FC<LinkButtonProps> = ({
  primary,
  children,
  className = '',
  ...props
}) => (
  <a
    className={`no-underline inline-flex items-center px-6 py-2 border border-solid text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
      primary
        ? 'border-transparent text-white bg-blue-france-sun-base hover:bg-blue-france-sun-hover focus:bg-blue-france-sun-active'
        : 'border-blue-france-sun-base text-blue-france-sun-base bg-white hover:bg-blue-france-975-base focus:bg-blue-france-975-base'
    } ${className}`}
    style={{ color: primary ? 'white' : '#000091', textDecoration: 'none' }}
    {...props}
  >
    {children}
    {props.excel && <DocumentReportIcon className="w-5 h-5 ml-1" />}
    {props.target && props.target === '_blank' && <ExternalLinkIcon className="w-5 h-5 ml-1" />}
    {isLinkMailTo(props.href) && <MailIcon className="w-5 h-5 ml-1" />}
  </a>
)
