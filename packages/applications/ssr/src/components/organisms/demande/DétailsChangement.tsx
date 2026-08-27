import type { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { DateTime, Email } from '@potentiel-domain/common';
import type { PlainType } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { Heading2 } from '@/components/atoms/headings';
import type { StatutDemandeBadgeProps } from '@/components/organisms/demande/StatutDemandeBadge';
import { DisplayAuteur } from '../../atoms/demande/DisplayAuteur';
import { ReadMore } from '../../atoms/ReadMore';

export type DétailsChangementProps = {
  changement: PlainType<{
    enregistréPar: Email.ValueType;
    enregistréLe: DateTime.ValueType;
    raison?: string;
    pièceJustificative?: DocumentProjet.ValueType;
  }>;
  statut: StatutDemandeBadgeProps['statut'];
  valeurs: React.ReactNode;
};

export const DétailsChangement: FC<DétailsChangementProps> = ({ changement, statut, valeurs }) => {
  const isInformationEnregistrée = statut === 'information-enregistrée';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <Heading2>
          {isInformationEnregistrée
            ? 'Détails du changement'
            : 'Détails de la demande de changement'}
        </Heading2>
        <div className="mb-2 italic">
          {isInformationEnregistrée ? 'Modifié' : 'Demandée'} le{' '}
          <FormattedDate
            className="font-medium"
            date={DateTime.bind(changement.enregistréLe).formatter()}
          />
          <DisplayAuteur email={Email.bind(changement.enregistréPar)} />
        </div>
        <div className="flex flex-col">{valeurs}</div>
        {changement.raison ? (
          <div className="flex gap-2">
            <div className="font-medium whitespace-nowrap">Raison du changement :</div>
            <ReadMore text={changement.raison} />
          </div>
        ) : null}
        {changement.pièceJustificative ? (
          <div className="flex gap-2">
            <div className="font-medium whitespace-nowrap">Pièce(s) justificative(s) :</div>
            <DownloadDocument
              className="mb-0"
              label="Télécharger la pièce justificative"
              format={changement.pièceJustificative.format}
              url={Routes.Document.télécharger(
                DocumentProjet.bind(changement.pièceJustificative).formatter(),
              )}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};
