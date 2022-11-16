import React, { FC } from 'react'
import { Link, FileDownloadIcon } from '../atoms'

type DownloadLinkProps = {
  fileUrl: string
  className?: string
  children?: React.ReactNode
}

export const DownloadLink: FC<DownloadLinkProps> = ({ children, className, fileUrl }) => (
  <Link className={className} href={fileUrl} download>
    {children}
    <FileDownloadIcon className="text-lg ml-1 -mb-1 shrink-0" />
  </Link>
)
