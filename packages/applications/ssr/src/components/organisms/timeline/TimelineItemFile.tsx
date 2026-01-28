import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

export const TimelineItemFile: FC<{
  document: DocumentProjet.ValueType;
  ariaLabel: string;
  label?: string;
}> = ({ document, ariaLabel, label }) => (
  <DownloadDocument
    small
    className="mb-0"
    label={label ?? 'Télécharger le document joint'}
    ariaLabel={ariaLabel}
    format={document.format}
    url={Routes.Document.télécharger(document.formatter())}
  />
);
