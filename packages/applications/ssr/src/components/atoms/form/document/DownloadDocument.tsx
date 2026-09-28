import { fr } from '@codegouvfr/react-dsfr';
import clsx from 'clsx';
import { extension } from 'mime-types';
import Link from 'next/link';
import type { FC } from 'react';

export type DownloadDocumentProps = {
  className?: string;
  label: string;
  url: string;
  format: string;
  ariaLabel?: string;
  small?: boolean;
  hideFormat?: boolean;
  download?: boolean;
};

export const DownloadDocument: FC<DownloadDocumentProps> = ({
  className = '',
  label,
  url,
  format,
  ariaLabel,
  small,
  download,
  hideFormat,
}) => {
  const realDownload = download ?? (extension(format) || format).toLowerCase() !== 'pdf';
  return (
    <div className={clsx(fr.cx('fr-download'), 'print:hidden', className)}>
      <Link
        className={clsx(fr.cx('fr-download__link'), { '!text-sm': small })}
        href={url}
        target="_blank"
        aria-label={`${ariaLabel ?? label}${realDownload ? '' : ' dans un nouvel onglet'}`}
        download={realDownload}
        prefetch={false}
      >
        {label}
        {!hideFormat && format && (
          <span className={fr.cx('fr-download__detail')}>
            {(extension(format) || format).toUpperCase()}
          </span>
        )}
      </Link>
    </div>
  );
};
