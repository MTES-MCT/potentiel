import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';

import { AbandonAggregate } from '../abandon.aggregate';

export type ConfirmationAbandonDemandéeEvent = DomainEvent<
  'ConfirmationAbandonDemandée-V1',
  {
    confirmationDemandéeLe: DateTime.RawType;
    confirmationDemandéePar: IdentifiantUtilisateur.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
    réponseSignée: {
      format: string;
    };
  }
>;

export type DemanderConfirmationOptions = {
  dateDemande: DateTime.ValueType;
  identifiantUtilisateur: IdentifiantUtilisateur.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
  réponseSignée: DocumentProjet.ValueType;
};

export async function demanderConfirmation(
  this: AbandonAggregate,
  {
    dateDemande,
    identifiantUtilisateur,
    identifiantProjet,
    réponseSignée,
  }: DemanderConfirmationOptions,
) {
  this.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
    Lauréat.Abandon.StatutAbandon.confirmationDemandée,
  );

  const event: ConfirmationAbandonDemandéeEvent = {
    type: 'ConfirmationAbandonDemandée-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      réponseSignée: {
        format: réponseSignée.format,
      },
      confirmationDemandéeLe: dateDemande.formatter(),
      confirmationDemandéePar: identifiantUtilisateur.formatter(),
    },
  };

  await this.publish(event);
}

export function applyConfirmationAbandonDemandée(
  this: AbandonAggregate,
  { payload: { confirmationDemandéeLe, réponseSignée } }: ConfirmationAbandonDemandéeEvent,
) {
  this.statut = Lauréat.Abandon.StatutAbandon.confirmationDemandée;

  this.demande.confirmation = {
    demandéLe: DateTime.convertirEnValueType(confirmationDemandéeLe),
    réponseSignée,
  };
}
