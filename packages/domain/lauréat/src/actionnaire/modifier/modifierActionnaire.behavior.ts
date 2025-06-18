import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';

import { ActionnaireAggregate } from '../actionnaire.aggregate';
import { DemandeDeChangementEnCoursError } from '../errors';

export type ModifierOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  actionnaire: string;
  dateModification: DateTime.ValueType;
  pièceJustificative?: DocumentProjet.ValueType;
  raison: string;
};

export async function modifier(
  this: ActionnaireAggregate,
  {
    identifiantProjet,
    actionnaire,
    dateModification,
    identifiantUtilisateur,
    pièceJustificative,
    raison,
  }: ModifierOptions,
) {
  if (this.demande?.statut.estDemandé()) {
    throw new DemandeDeChangementEnCoursError();
  }

  const event: Lauréat.Actionnaire.ActionnaireModifiéEvent = {
    type: 'ActionnaireModifié-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      actionnaire,
      modifiéLe: dateModification.formatter(),
      modifiéPar: identifiantUtilisateur.formatter(),
      raison,
      pièceJustificative: pièceJustificative && {
        format: pièceJustificative.format,
      },
    },
  };

  await this.publish(event);
}

export function applyActionnaireModifié(
  this: ActionnaireAggregate,
  { payload: { actionnaire } }: Lauréat.Actionnaire.ActionnaireModifiéEvent,
) {
  this.actionnaire = actionnaire;
}
