import { IdentifiantProjet } from '@potentiel-domain/common';
import { Aggregate, GetDefaultAggregateState, LoadAggregate } from '@potentiel-domain/core';

import * as StatutCandidature from './statutCandidature.valueType';
import {
  CandidatureImportéeEvent,
  applyCandidatureImportée,
  importer,
} from './importer/importerCandidature.behavior';

export type CandidatureEvent = CandidatureImportéeEvent;

export type CandidatureAggregate = Aggregate<CandidatureEvent> & {
  statut: StatutCandidature.ValueType;
  importer: typeof importer;
};

export const getDefaultCandidatureAggregate: GetDefaultAggregateState<
  CandidatureAggregate,
  CandidatureEvent
> = () => ({
  identifiantProjet: IdentifiantProjet.inconnu,
  statut: StatutCandidature.inconnu,
  apply,
  importer,
});

function apply(this: CandidatureAggregate, event: CandidatureEvent) {
  switch (event.type) {
    case 'CandidatureImportée-V1':
      applyCandidatureImportée.bind(this)(event);
      break;
  }
}

export function loadCandidatureAggregateFactory(loadAggregate: LoadAggregate) {
  return (identifiantProjet: IdentifiantProjet.ValueType) => {
    return loadAggregate({
      aggregateId: `candidature|${identifiantProjet.formatter()}`,
      getDefaultAggregate: getDefaultCandidatureAggregate,
    });
  };
}
