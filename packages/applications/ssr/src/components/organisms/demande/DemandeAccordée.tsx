import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/projet';

import { DownloadDocument } from '../../atoms/form/document/DownloadDocument';
import { FormattedDate } from '../../atoms/FormattedDate';
import { Heading5 } from '../../atoms/headings';
import { DisplayAuteur } from '../../atoms/demande/DisplayAuteur';

import { DétailsDemandeProps } from './DétailsDemande';

type DemandeAccordéeProps = NonNullable<DétailsDemandeProps['demande']['accord']>;

export const DemandeAccordée: FC<DemandeAccordéeProps> = ({
  accordéeLe,
  accordéePar,
  réponseSignée,
}) => (
  <div>
    <Heading5>Accord</Heading5>
    <div>
      Accordée le{' '}
      <FormattedDate className="font-medium" date={DateTime.bind(accordéeLe).formatter()} />
      <DisplayAuteur email={Email.bind(accordéePar)} />
    </div>
    {réponseSignée && (
      <div className="flex gap-2">
        <div className="font-medium whitespace-nowrap">Réponse signée :</div>
        <DownloadDocument
          className="mb-0"
          label="Télécharger la réponse signée"
          format={réponseSignée.format}
          url={Routes.Document.télécharger(DocumentProjet.bind(réponseSignée).formatter())}
        />
      </div>
    )}
  </div>
);
