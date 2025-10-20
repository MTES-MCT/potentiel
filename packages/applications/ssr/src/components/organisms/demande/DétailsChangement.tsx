import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { DateTime, Email } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { Heading2, Heading5 } from '@/components/atoms/headings';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import {
  StatutDemandeBadge,
  StatutDemandeBadgeProps,
} from '@/components/organisms/demande/StatutDemandeBadge';

import { ReadMore } from '../../atoms/ReadMore';

export type DétailsChangementProps = {
  changement: PlainType<{
    enregistréPar: Email.ValueType;
    enregistréLe: DateTime.ValueType;
    raison?: string;
    pièceJustificative?: DocumentProjet.ValueType;
  }>;
  title: string;
  statut: StatutDemandeBadgeProps['statut'];
  détailsValeursDuDomaine: React.ReactNode;
};

export const DétailsChangement: FC<DétailsChangementProps> = ({
  changement,
  title,
  statut,
  détailsValeursDuDomaine,
}) => {
  const isInformationEnregistrée = statut === 'information-enregistrée';

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex flex-row gap-4">
          <div>
            <Heading2>{title}</Heading2>
          </div>
          <StatutDemandeBadge statut={statut} />
        </div>
      </div>
      <div className="flex flex-col">
        <Heading5>
          {isInformationEnregistrée
            ? 'Détails du changement'
            : 'Détails de la demande de changement'}
        </Heading5>
        <div className="mb-2 italic">
          {isInformationEnregistrée ? 'Modifié' : 'Demandée'} le{' '}
          <FormattedDate
            className="font-medium"
            date={DateTime.bind(changement.enregistréLe).formatter()}
          />{' '}
          par{' '}
          <span className="font-medium">{Email.bind(changement.enregistréPar).formatter()}</span>
        </div>
        <div className="flex flex-col">{détailsValeursDuDomaine}</div>
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
