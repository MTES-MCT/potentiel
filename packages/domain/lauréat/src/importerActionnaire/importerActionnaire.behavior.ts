import { DomainError, DomainEvent } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { LauréatAggregate } from '../lauréat.aggregate';

export type ActionnaireLauréatImportéEvent = DomainEvent<
  'ActionnaireLauréatImporté-V1',
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
  this: LauréatAggregate,
  { identifiantProjet, actionnaire, importéLe }: ImporterOptions,
) {
  if (this.actionnaire) {
    throw new ActionnaireDéjàImportéError();
  }

  const event: ActionnaireLauréatImportéEvent = {
    type: 'ActionnaireLauréatImporté-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      actionnaire,
      importéLe: importéLe.formatter(),
    },
  };

  await this.publish(event);
}

export function applyActionnaireImporté(
  this: LauréatAggregate,
  { payload: { actionnaire } }: ActionnaireLauréatImportéEvent,
) {
  this.actionnaire = actionnaire;
}

class ActionnaireDéjàImportéError extends DomainError {
  constructor() {
    super("L'actionnaire a déjà été importé");
  }
}
