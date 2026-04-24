import { FC } from 'react';
import { extension } from 'mime-types';
import clsx from 'clsx';
import Link from 'next/link';
import { fr } from '@codegouvfr/react-dsfr';

export type DownloadDocumentProps = {
  className?: string;
  label: string;
  url: string;
  format: string;
  ariaLabel?: string;
  small?: boolean;
  download?: boolean;
};

export const DownloadDocument: FC<DownloadDocumentProps> = ({
  className = '',
  label,
  url,
  format,
  ariaLabel = '',
  small,
  download,
}) => (
  <div className={clsx(fr.cx('fr-download'), 'print:hidden', className)}>
    <Link
      className={clsx(fr.cx('fr-download__link'), { '!text-sm': small })}
      href={url}
      target="_blank"
      aria-label={ariaLabel}
      download={download}
      data-fr-assess-file
      prefetch={false}
    >
      {label}
      <span className={fr.cx('fr-download__detail')}>
        {(extension(format) || format).toUpperCase()}
      </span>
    </Link>
  </div>
);
