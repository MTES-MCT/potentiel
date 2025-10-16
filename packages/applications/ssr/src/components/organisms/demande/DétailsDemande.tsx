import { FC } from 'react';

import { DateTime, Email } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { PlainType } from '@potentiel-domain/core';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { Heading5 } from '@/components/atoms/headings';

import { StatutDemandeBadgeProps } from './StatutDemandeBadge';

export type DétailsDemandeProps = {
  demande: {
    demandéePar: string;
    demandéeLe: DateTime.RawType;
    raison?: string;
    statut: StatutDemandeBadgeProps['statut'];
    pièceJustificative?: {
      format: string;
    };
    accord?: {
      réponseSignée?: {
        format: string;
      };
      accordéePar: string;
      accordéeLe: DateTime.RawType;
    };

    rejet?: {
      réponseSignée: {
        format: string;
      };
      rejetéePar: string;
      rejetéeLe: DateTime.RawType;
    };
  };
  détailsChangement: React.ReactNode;
};

export const DétailsDemande: FC<DétailsDemandeProps> = ({ demande, détailsChangement }) => {

  return (
    <div className="flex flex-col gap-4">
      {détailsChangement}
      {demande.accord && (
        <ChangementAccordé
          accordéeLe={demande.accord.accordéeLe}
          accordéePar={demande.accord.accordéePar}
          réponseSignée={demande.accord.réponseSignée}
        />
      )}
      {demande.rejet && (
        <ChangementRejeté
          rejetéeLe={demande.rejet.rejetéeLe}
          rejetéePar={demande.rejet.rejetéePar}
          réponseSignée={demande.rejet.réponseSignée}
        />
      )}
    </div>
  );
};

type ChangementAccordéProps = NonNullable<DétailsDemandeProps['demande']['accord']>;

const ChangementAccordé: FC<ChangementAccordéProps> = ({
  accordéeLe,
  accordéePar,
  réponseSignée,
}) => (
  <div>
    <Heading5>Accord</Heading5>
    <div>
      Accordée le{' '}
      <FormattedDate className="font-medium" date={DateTime.bind(accordéeLe).formatter()} />, par{' '}
      <span className="font-medium">{Email.bind(accordéePar).formatter()}</span>
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

type ChangementRejetéProps = NonNullable<DétailsDemandeProps['demande']['rejet']>;

const ChangementRejeté: FC<ChangementRejetéProps> = ({ rejetéeLe, rejetéePar, réponseSignée }) => (
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
