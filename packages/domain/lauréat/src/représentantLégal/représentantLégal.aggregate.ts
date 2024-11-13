import {
  Aggregate,
  AggregateNotFoundError,
  GetDefaultAggregateState,
  LoadAggregate,
} from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';

import {
  applyReprésentantLégalImporté,
  importer,
  ReprésentantLégalImportéEvent,
} from './importer/importerReprésentantLégal.behavior';
import {
  applyReprésentantLégalCorrigé,
  corriger,
  ReprésentantLégalCorrigéEvent,
} from './corriger/corrigerReprésentantLégal.behavior';

export type ReprésentantLégalEvent = ReprésentantLégalImportéEvent | ReprésentantLégalCorrigéEvent;

export type ReprésentantLégalAggregate = Aggregate<ReprésentantLégalEvent> & {
  nomReprésentantLégal: string;
  readonly importer: typeof importer;
  readonly corriger: typeof corriger;
};

export const getDefaultReprésentantLégalAggregate: GetDefaultAggregateState<
  ReprésentantLégalAggregate,
  ReprésentantLégalEvent
> = () => ({
  apply,
  nomReprésentantLégal: '',
  importer,
  corriger,
});

function apply(this: ReprésentantLégalAggregate, event: ReprésentantLégalEvent) {
  switch (event.type) {
    case 'ReprésentantLégalImporté-V1':
      applyReprésentantLégalImporté.bind(this)(event);
      break;
    case 'ReprésentantLégalCorrigé-V1':
      applyReprésentantLégalCorrigé.bind(this)(event);
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
