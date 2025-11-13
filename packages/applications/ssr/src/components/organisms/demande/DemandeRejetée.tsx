import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/projet';

import { DownloadDocument } from '../../atoms/form/document/DownloadDocument';
import { FormattedDate } from '../../atoms/FormattedDate';
import { Heading5 } from '../../atoms/headings';
import { ReadMore } from '../../atoms/ReadMore';
import { DisplayAuteur } from '../../atoms/demande/DisplayAuteur';

import { DétailsDemandeProps } from './DétailsDemande';

type DemandeRejetéeProps = NonNullable<DétailsDemandeProps['demande']['rejet']>;

export const DemandeRejetée: FC<DemandeRejetéeProps> = ({
  rejetéeLe,
  rejetéePar,
  réponseSignée,
  motif,
}) => (
  <div>
    <Heading5>Rejet</Heading5>
    <div>
      Rejetée le{' '}
      <FormattedDate className="font-medium" date={DateTime.bind(rejetéeLe).formatter()} />
      <DisplayAuteur email={Email.bind(rejetéePar)} />
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
    {motif && (
      <div className="flex gap-2">
        <div className="font-medium">Motif :</div>
        <ReadMore text={motif} />
      </div>
    )}
  </div>
);
