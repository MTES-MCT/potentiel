import { match } from 'ts-pattern';

import { IdentifiantProjet } from '@potentiel-domain/common';
import {
  Aggregate,
  AggregateNotFoundError,
  GetDefaultAggregateState,
  LoadAggregate,
} from '@potentiel-domain/core';

import { applyPuissanceImportée, importer } from './importer/importerPuissance.behavior';
import { PuissanceImportéeEvent } from './importer/importerPuissance.behavior';
import {
  applypuissanceModifiée,
  modifier,
  PuissanceModifiéeEvent,
} from './modifier/modifierPuissance.behavior';

export type PuissanceEvent = PuissanceImportéeEvent | PuissanceModifiéeEvent;

export type PuissanceAggregate = Aggregate<PuissanceEvent> & {
  identifiantProjet: IdentifiantProjet.ValueType;
  puissance: number;
  importer: typeof importer;
  modifier: typeof modifier;
};

export const getDefaultPuissanceAggregate: GetDefaultAggregateState<
  PuissanceAggregate,
  PuissanceEvent
> = () => ({
  identifiantProjet: IdentifiantProjet.inconnu,
  puissance: 0,
  apply,
  importer,
  modifier,
});

function apply(this: PuissanceAggregate, event: PuissanceEvent) {
  match(event)
    .with({ type: 'PuissanceImportée-V1' }, applyPuissanceImportée.bind(this))
    .with({ type: 'PuissanceModifiée-V1' }, applypuissanceModifiée.bind(this))
    .exhaustive();
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
