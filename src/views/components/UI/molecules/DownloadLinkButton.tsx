import React, { ComponentProps, FC } from 'react'
import { LinkButton, FileDownloadIcon } from '../atoms'

type DownloadLinkButtonProps = ComponentProps<'a'>

export const DownloadLinkButton: FC<DownloadLinkButtonProps> = ({ children, ...props }) => (
  <LinkButton download primary {...props}>
    <FileDownloadIcon className="mr-2" />
    {children}
  </LinkButton>
)
