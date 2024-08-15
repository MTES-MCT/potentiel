import { IdentifiantProjet } from '@potentiel-domain/common';
import { Aggregate, GetDefaultAggregateState, LoadAggregate } from '@potentiel-domain/core';

import * as StatutCandidature from './statutCandidature.valueType';
import {
  CandidatureImportéeEvent,
  applyCandidatureImportée,
  importer,
} from './importer/importerCandidature.behavior';
import {
  CandidatureCorrigéeEvent,
  applyCandidatureCorrigée,
  corriger,
} from './corriger/corrigerCandidature.behavior';

export type CandidatureEvent = CandidatureImportéeEvent | CandidatureCorrigéeEvent;

export type CandidatureAggregate = Aggregate<CandidatureEvent> & {
  statut?: StatutCandidature.ValueType;
  importé?: true;
  importer: typeof importer;
  corriger: typeof corriger;
};

export const getDefaultCandidatureAggregate: GetDefaultAggregateState<
  CandidatureAggregate,
  CandidatureEvent
> = () => ({
  identifiantProjet: IdentifiantProjet.inconnu,
  apply,
  importer,
  corriger,
});

function apply(this: CandidatureAggregate, event: CandidatureEvent) {
  switch (event.type) {
    case 'CandidatureImportée-V1':
      applyCandidatureImportée.bind(this)(event);
      break;
    case 'CandidatureCorrigée-V1':
      applyCandidatureCorrigée.bind(this)(event);
      break;
  }
}

export function loadCandidatureFactory(loadAggregate: LoadAggregate) {
  return (identifiantProjet: IdentifiantProjet.ValueType) => {
    return loadAggregate({
      aggregateId: `candidature|${identifiantProjet.formatter()}`,
      getDefaultAggregate: getDefaultCandidatureAggregate,
    });
  };
}
