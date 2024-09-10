import React, { FC } from 'react';
import { LinkButton, FilePreviewIcon } from '../atoms';

type PreviewLinkButtonProps = {
  className?: string;
  fileUrl: string;
  children: React.ReactNode;
};

export const PreviewLinkButton: FC<PreviewLinkButtonProps> = ({ children, className, fileUrl }) => (
  <LinkButton className={className} target="_blank" href={fileUrl}>
    <FilePreviewIcon className="mr-2" aria-hidden />
    {children}
  </LinkButton>
);
