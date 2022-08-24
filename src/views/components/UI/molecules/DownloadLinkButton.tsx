import React, { FC } from 'react'
import { LinkButton, FileDownloadIcon } from '../atoms'

type DownloadLinkButtonProps = {
  className?: string
  fileUrl: string
}

export const DownloadLinkButton: FC<DownloadLinkButtonProps> = ({
  children,
  className,
  fileUrl,
}) => (
  <LinkButton className={className} download primary href={fileUrl}>
    <FileDownloadIcon className="mr-2" />
    {children}
  </LinkButton>
)
