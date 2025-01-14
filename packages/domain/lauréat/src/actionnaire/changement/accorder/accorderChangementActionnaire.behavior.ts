import { DateTime, IdentifiantProjet, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';

import { ActionnaireAggregate } from '../../actionnaire.aggregate';
import { StatutChangementActionnaire } from '../..';
import { ChangementActionnaireInexistanteErreur } from '../../errors';

export type ChangementActionnaireAccordéEvent = DomainEvent<
  'ChangementActionnaireAccordé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    accordéLe: DateTime.RawType;
    accordéPar: Email.RawType;
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

export async function accorderChangementActionnaire(
  this: ActionnaireAggregate,
  { identifiantProjet, accordéeLe, accordéePar, réponseSignée }: Options,
) {
  if (!this.demande) {
    throw new ChangementActionnaireInexistanteErreur();
  }

  this.demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
    StatutChangementActionnaire.accordé,
  );

  const event: ChangementActionnaireAccordéEvent = {
    type: 'ChangementActionnaireAccordé-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      accordéLe: accordéeLe.formatter(),
      accordéPar: accordéePar.formatter(),
      réponseSignée: {
        format: réponseSignée.format,
      },
      nouvelActionnaire: this.demande.nouvelActionnaire,
    },
  };

  await this.publish(event);
}

export function applyChangementActionnaireAccordé(
  this: ActionnaireAggregate,
  { payload: { nouvelActionnaire } }: ChangementActionnaireAccordéEvent,
) {
  this.actionnaire = nouvelActionnaire;
  this.demande = {
    nouvelActionnaire,
    statut: StatutChangementActionnaire.accordé,
  };
}
