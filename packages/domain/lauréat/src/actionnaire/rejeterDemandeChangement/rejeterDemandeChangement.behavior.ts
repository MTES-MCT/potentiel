import { DateTime, IdentifiantProjet, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';

import { ActionnaireAggregate } from '../actionnaire.aggregate';
import { StatutChangementActionnaire } from '..';
import { DemandeChangementActionnaireInexistanteErreur } from '../errors';

export type DemandeChangementActionnaireRejetéeEvent = DomainEvent<
  'DemandeChangementActionnaireRejetée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    rejetéeLe: DateTime.RawType;
    rejetéePar: Email.RawType;
    réponseSignée: {
      format: string;
    };
    nouvelActionnaire: string;
  }
>;

type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
  rejetéeLe: DateTime.ValueType;
  rejetéePar: Email.ValueType;
  réponseSignée: DocumentProjet.ValueType;
};

export async function rejeterDemandeChangementActionnaire(
  this: ActionnaireAggregate,
  { identifiantProjet, rejetéeLe, rejetéePar, réponseSignée }: Options,
) {
  if (!this.demande) {
    throw new DemandeChangementActionnaireInexistanteErreur();
  }

  this.demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
    StatutChangementActionnaire.rejetée,
  );

  const event: DemandeChangementActionnaireRejetéeEvent = {
    type: 'DemandeChangementActionnaireRejetée-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      rejetéeLe: rejetéeLe.formatter(),
      rejetéePar: rejetéePar.formatter(),
      réponseSignée: {
        format: réponseSignée.format,
      },
      nouvelActionnaire: this.demande.nouvelActionnaire,
    },
  };

  await this.publish(event);
}

export function applyDemandeChangementActionnaireRejetée(
  this: ActionnaireAggregate,
  { payload: { nouvelActionnaire } }: DemandeChangementActionnaireRejetéeEvent,
) {
  this.actionnaire = nouvelActionnaire;
  this.demande = {
    nouvelActionnaire,
    statut: StatutChangementActionnaire.rejetée,
  };
}
