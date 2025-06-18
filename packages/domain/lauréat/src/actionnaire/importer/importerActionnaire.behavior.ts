import { DomainError } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { ActionnaireAggregate } from '../actionnaire.aggregate';

export type ImporterOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  actionnaire: string;
  importéLe: DateTime.ValueType;
};

export async function importer(
  this: ActionnaireAggregate,
  { identifiantProjet, actionnaire, importéLe }: ImporterOptions,
) {
  if (this.actionnaire) {
    throw new ActionnaireDéjàImportéError();
  }

  const event: Lauréat.Actionnaire.ActionnaireImportéEvent = {
    type: 'ActionnaireImporté-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      actionnaire,
      importéLe: importéLe.formatter(),
    },
  };

  await this.publish(event);
}

export function applyActionnaireImporté(
  this: ActionnaireAggregate,
  { payload: { actionnaire, identifiantProjet } }: Lauréat.Actionnaire.ActionnaireImportéEvent,
) {
  this.identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjet);
  this.actionnaire = actionnaire;
}

class ActionnaireDéjàImportéError extends DomainError {
  constructor() {
    super("L'actionnaire a déjà été importé");
  }
}
