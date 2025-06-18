import { DateTime, IdentifiantProjet, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';

import { StatutChangementActionnaire } from '../..';
import { ActionnaireAggregate } from '../../actionnaire.aggregate';
import { ChangementActionnaireInexistanteErreur } from '../../errors';

type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
  rejetéLe: DateTime.ValueType;
  rejetéPar: Email.ValueType;
  réponseSignée: DocumentProjet.ValueType;
};

export async function rejeterChangementActionnaire(
  this: ActionnaireAggregate,
  { identifiantProjet, rejetéLe, rejetéPar, réponseSignée }: Options,
) {
  if (!this.demande) {
    throw new ChangementActionnaireInexistanteErreur();
  }

  this.demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
    StatutChangementActionnaire.rejeté,
  );

  const event: Lauréat.Actionnaire.ChangementActionnaireRejetéEvent = {
    type: 'ChangementActionnaireRejeté-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      rejetéLe: rejetéLe.formatter(),
      rejetéPar: rejetéPar.formatter(),
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
