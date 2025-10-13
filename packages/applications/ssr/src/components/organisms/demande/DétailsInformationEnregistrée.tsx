import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { DateTime, Email } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { Heading2, Heading5 } from '@/components/atoms/headings';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { StatutDemandeBadge } from '@/components/organisms/demande/StatutDemandeBadge';

import { ReadMore } from '../../atoms/ReadMore';

export type DétailsInformationEnregistréeProps = {
  changement: PlainType<{
    enregistréPar: Email.ValueType;
    enregistréLe: DateTime.ValueType;
    raison?: string;
    pièceJustificative?: DocumentProjet.ValueType;
  }>;
  title: string;
  détailsSpécifiques: React.ReactNode;
};

export const DétailsInformationEnregistrée: FC<DétailsInformationEnregistréeProps> = ({
  changement,
  title,
  détailsSpécifiques,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex flex-row gap-4">
          <div>
            <Heading2>{title}</Heading2>
          </div>
          <StatutDemandeBadge statut="information-enregistrée" />
        </div>
        <div className="text-xs italic">
          Modifié le{' '}
          <FormattedDate
            className="font-medium"
            date={DateTime.bind(changement.enregistréLe).formatter()}
          />{' '}
          par{' '}
          <span className="font-medium">{Email.bind(changement.enregistréPar).formatter()}</span>
        </div>
      </div>
      <div className="flex flex-col">
        <Heading5>Détails du changement</Heading5>
        <div className="flex flex-col">{détailsSpécifiques}</div>
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
