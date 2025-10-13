import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { DateTime, Email } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';

import { Heading5 } from '@/components/atoms/headings';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

export type DemandeChangementActionnaireRejetéeProps = NonNullable<
  PlainType<Lauréat.Actionnaire.ConsulterChangementActionnaireReadModel['demande']>['rejet']
>;

export const DemandeChangementActionnaireRejetée: FC<DemandeChangementActionnaireRejetéeProps> = ({
  rejetéeLe,
  rejetéePar,
  réponseSignée,
}) => (
  <div>
    <Heading5>Rejet</Heading5>
    <div>
      Rejetée le{' '}
      <FormattedDate className="font-medium" date={DateTime.bind(rejetéeLe).formatter()} />, par{' '}
      <span className="font-medium">{Email.bind(rejetéePar).formatter()}</span>
    </div>
    <div className="flex gap-2">
      <div className="font-medium whitespace-nowrap">Réponse signée :</div>
      <DownloadDocument
        className="mb-0"
        label="Télécharger la réponse signée"
        format={réponseSignée.format}
        url={Routes.Document.télécharger(DocumentProjet.bind(réponseSignée).formatter())}
      />
    </div>
  </div>
);
