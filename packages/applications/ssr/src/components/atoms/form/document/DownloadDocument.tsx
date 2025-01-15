import { FC } from 'react';
import { Download } from '@codegouvfr/react-dsfr/Download';
import { extension } from 'mime-types';
export type DownloadDocumentProps = {
  className?: string;
  label: string;
  url: string;
  format: string;
};

export const DownloadDocument: FC<DownloadDocumentProps> = ({
  className = '',
  label,
  url,
  format,
}) => (
  <Download
    className={className}
    label={label}
    details={(extension(format) || format).toUpperCase()}
    linkProps={{
      href: url,
      target: '_blank',
    }}
  />
);
