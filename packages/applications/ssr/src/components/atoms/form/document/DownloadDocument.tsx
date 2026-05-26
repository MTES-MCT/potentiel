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
  hideFormat?: boolean;
};

export const DownloadDocument: FC<DownloadDocumentProps> = ({
  className = '',
  label,
  url,
  format,
  ariaLabel = '',
  small,
  hideFormat,
}) => (
  <Download
    className={clsx('print:hidden', className)}
    label={label}
    classes={{
      link: small ? '!text-sm' : undefined,
    }}
    details={hideFormat ? undefined : (extension(format) || format).toUpperCase()}
    linkProps={{
      href: url,
      target: '_blank',
      'aria-label': ariaLabel,
      prefetch: false,
    }}
  />
);
