import React, { FC } from 'react'
import { Link, FileDownloadIcon } from '../atoms'

type DownloadLinkProps = {
  className?: string
  fileUrl: string
}

export const DownloadLink: FC<DownloadLinkProps> = ({ children, className, fileUrl }) => (
  <Link className={className} href={fileUrl} download>
    {children}
    <FileDownloadIcon className="text-lg ml-1" />
  </Link>
)
