import React, { FC, ComponentProps } from 'react'
import { Link, ExternalLinkIcon } from '../atoms'

type ExternalLinkProps = ComponentProps<'a'>

export const ExternalLink: FC<ExternalLinkProps> = ({ children, className = '', ...props }) => (
  <Link className={className} target="_blank" rel="noopener noreferrer" {...props}>
    {children}
    <ExternalLinkIcon className="text-lg ml-1 -mb-1" />
  </Link>
)
