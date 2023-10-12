import React, { FC } from 'react';
import { LinkButton, FileDownloadIcon } from '../atoms';

type DownloadLinkButtonProps = {
  className?: string;
  fileUrl: string;
  children?: React.ReactNode;
};

export const DownloadLinkButton: FC<DownloadLinkButtonProps> = ({
  children,
  className,
  fileUrl,
}) => (
  <LinkButton className={className} download href={fileUrl}>
    <FileDownloadIcon className="mr-2" aria-hidden />
    {children}
  </LinkButton>
);
