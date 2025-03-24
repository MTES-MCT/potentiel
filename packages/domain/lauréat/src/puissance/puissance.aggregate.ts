import { IdentifiantProjet } from '@potentiel-domain/common';
import {
  Aggregate,
  AggregateNotFoundError,
  GetDefaultAggregateState,
  LoadAggregate,
} from '@potentiel-domain/core';

import { applyPuissanceImportée, importer } from './importer/importerPuissance.behavior';
import { PuissanceImportéeEvent } from './importer/importerPuissance.behavior';

export type PuissanceEvent = PuissanceImportéeEvent;

export type PuissanceAggregate = Aggregate<PuissanceEvent> & {
  identifiantProjet: IdentifiantProjet.ValueType;
  puissance: number;
  importer: typeof importer;
};

export const getDefaultPuissanceAggregate: GetDefaultAggregateState<
  PuissanceAggregate,
  PuissanceEvent
> = () => ({
  identifiantProjet: IdentifiantProjet.inconnu,
  puissance: 0,
  apply,
  importer,
});

function apply(this: PuissanceAggregate, event: PuissanceEvent) {
  switch (event.type) {
    case 'PuissanceImportée-V1':
      applyPuissanceImportée.bind(this)(event);
      break;
  }
}

export const loadPuissanceFactory =
  (loadAggregate: LoadAggregate) =>
  (identifiantProjet: IdentifiantProjet.ValueType, throwOnNone = true) => {
    return loadAggregate({
      aggregateId: `puissance|${identifiantProjet.formatter()}`,
      getDefaultAggregate: getDefaultPuissanceAggregate,
      onNone: throwOnNone
        ? () => {
            throw new PuissanceNonTrouvéeError();
          }
        : undefined,
    });
  };

class PuissanceNonTrouvéeError extends AggregateNotFoundError {
  constructor() {
    super(`La puissance n'existe pas`);
  }
}
