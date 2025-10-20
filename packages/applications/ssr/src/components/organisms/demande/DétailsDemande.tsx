import { FC } from 'react';

import { DateTime, Email } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { PlainType } from '@potentiel-domain/core';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { Heading5 } from '@/components/atoms/headings';

import { ReadMore } from '../../atoms/ReadMore';

import { StatutDemandeBadgeProps } from './StatutDemandeBadge';
import { DétailsChangement } from './DétailsChangement';

export type DétailsDemandeProps = {
  title: string;
  statut: StatutDemandeBadgeProps['statut'];
  demande: PlainType<{
    demandéePar: Email.ValueType;
    demandéeLe: DateTime.ValueType;
    raison?: string;
    pièceJustificative?: DocumentProjet.ValueType;
    accord?: {
      accordéePar: Email.ValueType;
      accordéeLe: DateTime.ValueType;
      réponseSignée?: DocumentProjet.ValueType;
    };
    rejet?: {
      rejetéePar: Email.ValueType;
      rejetéeLe: DateTime.ValueType;
      réponseSignée?: DocumentProjet.ValueType;
      motif?: string;
    };
  }>;
  valeurs: React.ReactNode;
};

export const DétailsDemande: FC<DétailsDemandeProps> = ({ title, statut, demande, valeurs }) => {
  return (
    <div className="flex flex-col gap-4">
      <DétailsChangement
        title={title}
        valeurs={valeurs}
        changement={{
          enregistréPar: demande.demandéePar,
          enregistréLe: demande.demandéeLe,
          raison: demande.raison,
          pièceJustificative: demande.pièceJustificative,
        }}
        statut={statut}
      />
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
          motif={demande.rejet.motif}
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

const ChangementRejeté: FC<ChangementRejetéProps> = ({
  rejetéeLe,
  rejetéePar,
  réponseSignée,
  motif,
}) => (
  <div>
    <Heading5>Rejet</Heading5>
    <div>
      Rejetée le{' '}
      <FormattedDate className="font-medium" date={DateTime.bind(rejetéeLe).formatter()} />, par{' '}
      <span className="font-medium">{Email.bind(rejetéePar).formatter()}</span>
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
