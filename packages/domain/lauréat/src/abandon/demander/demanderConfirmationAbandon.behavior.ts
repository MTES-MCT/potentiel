import { DateTime, IdentifiantProjet, IdentifiantUtilisateur } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { AbandonAggregate } from '../abandon.aggregate';
import * as StatutAbandon from '../statutAbandon.valueType';
import { RéponseSignéeValueType } from '../réponseSignée.valueType';

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
  confirmationDemandéePar: IdentifiantUtilisateur.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
  réponseSignée: RéponseSignéeValueType;
};

export async function demanderConfirmation(
  this: AbandonAggregate,
  { confirmationDemandéePar, identifiantProjet, réponseSignée }: DemanderConfirmationOptions,
) {
  this.statut.vérifierQueLeChangementDeStatutEstPossibleEn(StatutAbandon.confirmationDemandée);

  const dateDemandeConfirmation = DateTime.now();

  const event: ConfirmationAbandonDemandéeEvent = {
    type: 'ConfirmationAbandonDemandée-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      réponseSignée: {
        format: réponseSignée.format,
      },
      confirmationDemandéeLe: dateDemandeConfirmation.formatter(),
      confirmationDemandéePar: confirmationDemandéePar.formatter(),
    },
  };

  await this.publish(event);
}

export function applyConfirmationAbandonDemandée(
  this: AbandonAggregate,
  { payload: { confirmationDemandéeLe, réponseSignée } }: ConfirmationAbandonDemandéeEvent,
) {
  this.statut = StatutAbandon.confirmationDemandée;

  this.demande.confirmation = {
    demandéLe: DateTime.convertirEnValueType(confirmationDemandéeLe),
    réponseSignée,
  };
}
