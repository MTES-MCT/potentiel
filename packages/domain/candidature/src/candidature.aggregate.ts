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
import {
  FamillePériodeAppelOffreInexistanteError,
  PériodeAppelOffreInexistanteError,
} from './appelOffreInexistant.error';

export type CandidatureEvent = CandidatureImportéeEvent | CandidatureCorrigéeEvent;

export type CandidatureAggregate = Aggregate<CandidatureEvent> & {
  statut?: StatutCandidature.ValueType;
  importé?: true;
  payloadHash: string;
  importer: typeof importer;
  corriger: typeof corriger;
  calculerHash(payload: CandidatureEvent['payload']): string;
  estIdentiqueÀ(payload: CandidatureEvent['payload']): boolean;

  récupererPériodeAO(
    appelOffre: AppelOffre.AppelOffreReadModel,
    idPériode: string,
  ): AppelOffre.Periode;
  récupererFamilleAO(
    appelOffre: AppelOffre.AppelOffreReadModel,
    idPériode: string,
    idFamille?: string,
  ): AppelOffre.Famille | undefined;
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
  calculerHash(payload) {
    return createHash('md5')
      .update(JSON.stringify(payload, Object.keys(payload).sort()))
      .digest('hex');
  },
  estIdentiqueÀ(payload) {
    return this.calculerHash(payload) === this.payloadHash;
  },
  récupererPériodeAO(appelOffre, idPériode) {
    const période = appelOffre.periodes.find((x) => x.id === idPériode);
    if (!période) {
      throw new PériodeAppelOffreInexistanteError(appelOffre.id, idPériode);
    }
    return période;
  },
  récupererFamilleAO(appelOffre, idPériode, idFamille) {
    if (!idFamille) {
      return undefined;
    }
    const période = this.récupererPériodeAO(appelOffre, idPériode);
    const famille = période.familles.find((x) => x.id === idFamille);
    if (!famille) {
      throw new FamillePériodeAppelOffreInexistanteError(appelOffre.id, idPériode, idFamille);
    }
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
  (identifiantProjet: IdentifiantProjet.ValueType, throwOnNone = true) => {
    return loadAggregate({
      aggregateId: `candidature|${identifiantProjet.formatter()}`,
      getDefaultAggregate: getDefaultCandidatureAggregate,
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
