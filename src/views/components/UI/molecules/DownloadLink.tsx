import React, { ComponentProps, FC } from 'react'
import { Link, FileDownloadIcon } from '../atoms'

type DownloadLinkProps = ComponentProps<'a'>

export const DownloadLink: FC<DownloadLinkProps> = ({ children, ...props }) => (
  <Link {...props} download>
    {children}
    <FileDownloadIcon className="text-lg ml-1" />
  </Link>
)
