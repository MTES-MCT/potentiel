import { DateTime, IdentifiantProjet, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';

import { StatutChangementActionnaire } from '../..';
import { ActionnaireAggregate } from '../../actionnaire.aggregate';
import { ChangementActionnaireInexistanteErreur } from '../../errors';

export type ChangementActionnaireRejetéEvent = DomainEvent<
  'ChangementActionnaireRejeté-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    rejetéLe: DateTime.RawType;
    rejetéPar: Email.RawType;
    réponseSignée: {
      format: string;
    };
  }
>;

type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
  rejetéeLe: DateTime.ValueType;
  rejetéePar: Email.ValueType;
  réponseSignée: DocumentProjet.ValueType;
};

export async function rejeterChangementActionnaire(
  this: ActionnaireAggregate,
  { identifiantProjet, rejetéeLe, rejetéePar, réponseSignée }: Options,
) {
  if (!this.demande) {
    throw new ChangementActionnaireInexistanteErreur();
  }

  this.demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
    StatutChangementActionnaire.rejeté,
  );

  const event: ChangementActionnaireRejetéEvent = {
    type: 'ChangementActionnaireRejeté-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      rejetéLe: rejetéeLe.formatter(),
      rejetéPar: rejetéePar.formatter(),
      réponseSignée: {
        format: réponseSignée.format,
      },
    },
  };

  await this.publish(event);
}

export function applyChangementActionnaireRejeté(this: ActionnaireAggregate) {
  this.demande = undefined;
}
