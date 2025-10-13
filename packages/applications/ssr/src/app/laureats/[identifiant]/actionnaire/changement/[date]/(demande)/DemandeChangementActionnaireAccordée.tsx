import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { DateTime, Email } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';

import { Heading5 } from '@/components/atoms/headings';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

type DemandeChangementActionnaireAccordéeProps = NonNullable<
  PlainType<Lauréat.Actionnaire.ConsulterChangementActionnaireReadModel['demande']>['accord']
>;

export const DemandeChangementActionnaireAccordée: FC<
  DemandeChangementActionnaireAccordéeProps
> = ({ accordéeLe, accordéePar, réponseSignée }) => (
  <div>
    <Heading5>Accord</Heading5>
    <div>
      Accordée le{' '}
      <FormattedDate className="font-medium" date={DateTime.bind(accordéeLe).formatter()} />, par{' '}
      <span className="font-medium">{Email.bind(accordéePar).formatter()}</span>
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
