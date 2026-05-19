import { Download } from '@codegouvfr/react-dsfr/Download';
import clsx from 'clsx';
import { extension } from 'mime-types';
import type { FC } from 'react';
export type DownloadDocumentProps = {
  className?: string;
  label: string;
  url: string;
  format: string;
  ariaLabel?: string;
  small?: boolean;
};

export const DownloadDocument: FC<DownloadDocumentProps> = ({
  className = '',
  label,
  url,
  format,
  ariaLabel = '',
  small,
}) => (
  <Download
    className={clsx('print:hidden', className)}
    label={label}
    classes={{
      link: small ? '!text-sm' : undefined,
    }}
    details={(extension(format) || format).toUpperCase()}
    linkProps={{
      href: url,
      target: '_blank',
      'aria-label': ariaLabel,
      prefetch: false,
    }}
  />
);
