import {
  Aggregate,
  AggregateNotFoundError,
  GetDefaultAggregateState,
  LoadAggregate,
} from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import {
  applyReprésentantLégalImporté,
  importer,
  ReprésentantLégalImportéEvent,
} from './importer/importerReprésentantLégal.behavior';

export type ReprésentantLégalEvent = ReprésentantLégalImportéEvent;

export type ReprésentantLégalAggregate = Aggregate<ReprésentantLégalEvent> & {
  nomReprésentantLégal: string;
  import: {
    importéLe: DateTime.ValueType;
    importéPar: Email.ValueType;
  };
  readonly importer: typeof importer;
};

export const getDefaultReprésentantLégalAggregate: GetDefaultAggregateState<
  ReprésentantLégalAggregate,
  ReprésentantLégalEvent
> = () => ({
  apply,
  nomReprésentantLégal: '',
  importer,
  import: {
    importéLe: DateTime.now(),
    importéPar: Email.inconnu(),
  },
});

function apply(this: ReprésentantLégalAggregate, event: ReprésentantLégalEvent) {
  switch (event.type) {
    case 'ReprésentantLégalImporté-V1':
      applyReprésentantLégalImporté.bind(this)(event);
      break;
  }
}

export const loadReprésentantLégalFactory =
  (loadAggregate: LoadAggregate) =>
  (identifiantProjet: IdentifiantProjet.ValueType, throwOnNone = true) => {
    return loadAggregate({
      aggregateId: `représentant-légal|${identifiantProjet.formatter()}`,
      getDefaultAggregate: getDefaultReprésentantLégalAggregate,
      onNone: throwOnNone
        ? () => {
            throw new AucunReprésentantLégalError();
          }
        : undefined,
    });
  };

class AucunReprésentantLégalError extends AggregateNotFoundError {
  constructor() {
    super(`Aucun représentant légal n'est associé à ce projet`);
  }
}
