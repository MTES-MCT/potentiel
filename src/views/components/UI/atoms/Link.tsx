import React, { ComponentProps, FC } from 'react'
import { ExternalLinkIcon, MailIcon } from '@heroicons/react/outline'
import { isLinkMailTo } from './helpers'

type LinkProps = ComponentProps<'a'>

export const Link: FC<LinkProps> = ({ className = '', children, ...props }) => (
  <a
    className={`text-blue-france-sun-base underline hover:text-blue-france-sun-base hover:underline focus:text-blue-france-sun-base focus:underline ${className}`}
    {...props}
  >
    {children}
    {props.target && props.target === '_blank' && <ExternalLinkIcon className="w-5 h-5 ml-1" />}
    {isLinkMailTo(props.href) && <MailIcon className="w-5 h-5 ml-1" />}
  </a>
)
