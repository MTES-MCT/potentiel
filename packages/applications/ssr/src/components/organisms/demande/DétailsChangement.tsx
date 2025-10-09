import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { DateTime, Email } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { Heading2, Heading4 } from '@/components/atoms/headings';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { StatutDemandeBadge } from '@/components/organisms/demande/StatutDemandeBadge';

export type DétailsChangementProps = {
  changement: PlainType<{
    enregistréPar: Email.ValueType;
    enregistréLe: DateTime.ValueType;
    raison?: string;
    pièceJustificative?: DocumentProjet.ValueType;
  }>;
  domaineLabel: string;
  détailsSpécifiques: React.ReactNode;
};

export const DétailsChangement: FC<DétailsChangementProps> = ({
  changement,
  domaineLabel,
  détailsSpécifiques,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex flex-row gap-4">
          <div>
            <Heading2>Changement de {domaineLabel}</Heading2>
          </div>
          <StatutDemandeBadge statut="information-enregistrée" />
        </div>
        <div className="text-xs italic">
          Modifié le{' '}
          <FormattedDate
            className="font-semibold"
            date={DateTime.bind(changement.enregistréLe).formatter()}
          />{' '}
          par{' '}
          <span className="font-semibold">{Email.bind(changement.enregistréPar).formatter()}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Heading4>Détails du changement</Heading4>
        <div className="flex flex-col gap-1">
          <div className="flex flex-col gap-2">{détailsSpécifiques}</div>
          {changement.raison ? (
            <div className="flex gap-2">
              <div className="font-semibold whitespace-nowrap">Raison du changement :</div>
              <div>{changement.raison}</div>
            </div>
          ) : null}
          {changement.pièceJustificative ? (
            <div className="flex gap-2">
              <div className="font-semibold whitespace-nowrap">Pièce(s) justificative(s) :</div>
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
    </div>
  );
};
