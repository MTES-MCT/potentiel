import { FC } from 'react';

import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { PlainType } from '@potentiel-domain/core';

import { StatutDemandeBadgeProps } from './StatutDemandeBadge';
import { DétailsChangement } from './DétailsChangement';
import { DemandeAccordée } from './DemandeAccordée';
import { DemandeRejetée } from './DemandeRejetée';

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
        <DemandeAccordée
          accordéeLe={demande.accord.accordéeLe}
          accordéePar={demande.accord.accordéePar}
          réponseSignée={demande.accord.réponseSignée}
        />
      )}
      {demande.rejet && (
        <DemandeRejetée
          rejetéeLe={demande.rejet.rejetéeLe}
          rejetéePar={demande.rejet.rejetéePar}
          réponseSignée={demande.rejet.réponseSignée}
          motif={demande.rejet.motif}
        />
      )}
    </div>
  );
};
