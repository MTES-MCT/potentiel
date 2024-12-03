import { DomainError, DomainEvent } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { ActionnaireAggregate } from '../actionnaire.aggregate';

export type ActionnaireImportéEvent = DomainEvent<
  'ActionnaireImporté-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    actionnaire: string;
    importéLe: DateTime.RawType;
  }
>;

export type ImporterOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  actionnaire: string;
  importéLe: DateTime.ValueType;
};

export async function importerActionnaire(
  this: ActionnaireAggregate,
  { identifiantProjet, actionnaire, importéLe }: ImporterOptions,
) {
  if (this.actionnaire) {
    throw new ActionnaireDéjàImportéError();
  }

  const event: ActionnaireImportéEvent = {
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
  { payload: { actionnaire } }: ActionnaireImportéEvent,
) {
  this.actionnaire = actionnaire;
}

class ActionnaireDéjàImportéError extends DomainError {
  constructor() {
    super("L'actionnaire a déjà été importé");
  }
}
