import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { Heading5 } from '@/components/atoms/headings';

import { DétailsActionnaire } from '../DétailsActionnaire';

import { DétailsDemandeChangementActionnaireProps } from './DétailsDemandeChangementActionnaire';

export const DemandeChangementActionnaire: FC<DétailsDemandeChangementActionnaireProps> = ({
  demande,
}) => (
  <div>
    <Heading5>Détails de la demande</Heading5>
    <div className="flex gap-2">
      <DétailsActionnaire nouvelActionnaire={demande.nouvelActionnaire} />
    </div>
    <div className="flex gap-2">
      <div className="font-medium whitespace-nowrap">Raison du changement :</div>
      <div>{demande.raison}</div>
    </div>
    {demande.pièceJustificative && (
      <div className="flex gap-2">
        <div className="font-medium whitespace-nowrap">Pièce(s) justificative(s) :</div>
        <DownloadDocument
          className="mb-0"
          label="Télécharger la pièce justificative"
          format={demande.pièceJustificative.format}
          url={Routes.Document.télécharger(
            DocumentProjet.bind(demande.pièceJustificative).formatter(),
          )}
        />
      </div>
    )}{' '}
  </div>
);
