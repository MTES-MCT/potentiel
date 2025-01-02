import { DateTime, IdentifiantProjet, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';

import { ActionnaireAggregate } from '../../actionnaire.aggregate';
import { StatutChangementActionnaire } from '../..';
import { DemandeChangementActionnaireInexistanteErreur } from '../../errors';

export type DemandeChangementActionnaireAccordéeEvent = DomainEvent<
  'DemandeChangementActionnaireAccordée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    accordéeLe: DateTime.RawType;
    accordéePar: Email.RawType;
    réponseSignée: {
      format: string;
    };
    nouvelActionnaire: string;
  }
>;

type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
  accordéeLe: DateTime.ValueType;
  accordéePar: Email.ValueType;
  réponseSignée: DocumentProjet.ValueType;
};

export async function accorderDemandeChangementActionnaire(
  this: ActionnaireAggregate,
  { identifiantProjet, accordéeLe, accordéePar, réponseSignée }: Options,
) {
  if (!this.demande) {
    throw new DemandeChangementActionnaireInexistanteErreur();
  }

  this.demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
    StatutChangementActionnaire.accordé,
  );

  const event: DemandeChangementActionnaireAccordéeEvent = {
    type: 'DemandeChangementActionnaireAccordée-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      accordéeLe: accordéeLe.formatter(),
      accordéePar: accordéePar.formatter(),
      réponseSignée: {
        format: réponseSignée.format,
      },
      nouvelActionnaire: this.demande.nouvelActionnaire,
    },
  };

  await this.publish(event);
}

export function applyDemandeChangementActionnaireAccordée(
  this: ActionnaireAggregate,
  { payload: { nouvelActionnaire } }: DemandeChangementActionnaireAccordéeEvent,
) {
  this.actionnaire = nouvelActionnaire;
  this.demande = {
    nouvelActionnaire,
    statut: StatutChangementActionnaire.accordé,
  };
}
