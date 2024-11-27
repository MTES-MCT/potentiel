import {
  Aggregate,
  AggregateNotFoundError,
  GetDefaultAggregateState,
  LoadAggregate,
} from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { TypeReprésentantLégal } from '.';

import {
  applyReprésentantLégalImporté,
  importer,
  ReprésentantLégalImportéEvent,
} from './importer/importerReprésentantLégal.behavior';
import {
  applyReprésentantLégalModifié,
  modifier,
  ReprésentantLégalModifiéEvent,
} from './modifier/modifierReprésentantLégal.behavior';

export type ReprésentantLégalEvent = ReprésentantLégalImportéEvent | ReprésentantLégalModifiéEvent;

export type ReprésentantLégalAggregate = Aggregate<ReprésentantLégalEvent> & {
  représentantLégal: {
    nom: string;
    type: string;
  };
  readonly importer: typeof importer;
  readonly modifier: typeof modifier;
};

export const getDefaultReprésentantLégalAggregate: GetDefaultAggregateState<
  ReprésentantLégalAggregate,
  ReprésentantLégalEvent
> = () => ({
  apply,
  représentantLégal: {
    nom: '',
    type: TypeReprésentantLégal.inconnu.formatter(),
  },
  importer,
  modifier,
});

function apply(this: ReprésentantLégalAggregate, event: ReprésentantLégalEvent) {
  switch (event.type) {
    case 'ReprésentantLégalImporté-V1':
      applyReprésentantLégalImporté.bind(this)(event);
      break;
    case 'ReprésentantLégalModifié-V1':
      applyReprésentantLégalModifié.bind(this)(event);
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
