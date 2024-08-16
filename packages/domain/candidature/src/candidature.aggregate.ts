import { createHash } from 'node:crypto';

import { IdentifiantProjet } from '@potentiel-domain/common';
import {
  Aggregate,
  AggregateNotFoundError,
  GetDefaultAggregateState,
  LoadAggregate,
} from '@potentiel-domain/core';
import { AppelOffre } from '@potentiel-domain/appel-offre';

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
  payloadHash: string;
  importer: typeof importer;
  corriger: typeof corriger;
  calculerHash(payload: CandidatureEvent['payload']): string;
  estIdentiqueÀ(payload: CandidatureEvent['payload']): boolean;
};

export const getDefaultCandidatureAggregate: GetDefaultAggregateState<
  CandidatureAggregate,
  CandidatureEvent
> = () => ({
  identifiantProjet: IdentifiantProjet.inconnu,
  payloadHash: '',
  apply,
  importer,
  corriger,
  calculerHash(payload: CandidatureEvent['payload']) {
    return createHash('md5')
      .update(JSON.stringify(payload, Object.keys(payload).sort()))
      .digest('hex');
  },
  estIdentiqueÀ(payload: CandidatureEvent['payload']) {
    return this.calculerHash(payload) === this.payloadHash;
  },
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

export const loadCandidatureFactory =
  (loadAggregate: LoadAggregate) =>
  (
    identifiantProjet: IdentifiantProjet.ValueType,
    appelOffre: AppelOffre.AppelOffreReadModel,
    throwOnNone = true,
  ) => {
    return loadAggregate({
      aggregateId: `candidature|${identifiantProjet.formatter()}`,
      getDefaultAggregate: () => getDefaultCandidatureAggregate(),
      onNone: throwOnNone
        ? () => {
            throw new CandidatureNonTrouvéeError();
          }
        : undefined,
    });
  };

class CandidatureNonTrouvéeError extends AggregateNotFoundError {
  constructor() {
    super(`La candidature n'existe pas`);
  }
}
