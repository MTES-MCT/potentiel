import { FC } from 'react';
import { Download } from '@codegouvfr/react-dsfr/Download';

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
    details={format.toUpperCase()}
    linkProps={{
      href: url,
      target: '_blank',
    }}
  />
);
