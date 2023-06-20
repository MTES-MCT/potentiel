import React, { ComponentProps, FC } from 'react';
import { Link, FileDownloadIcon } from '../atoms';

type DownloadLinkProps = ComponentProps<'a'> & {
  className?: string;
  fileUrl: string;
};

export const DownloadLink: FC<DownloadLinkProps> = ({ children, className, fileUrl, ...props }) => (
  <Link className={className} href={fileUrl} download {...props}>
    <FileDownloadIcon className="text-lg mr-1 -mb-1 shrink-0" aria-hidden />
    {children}
  </Link>
);
