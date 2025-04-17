import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Aggregate, GetDefaultAggregateState, LoadAggregate } from '@potentiel-domain/core';

import * as StatutCandidature from './statutCandidature.valueType';
import * as TypeGarantiesFinancières from './typeGarantiesFinancières.valueType';
import {
  CandidatureImportéeEvent,
  applyCandidatureImportée,
} from './importer/importerCandidature.behavior';
import {
  CandidatureCorrigéeEvent,
  applyCandidatureCorrigée,
} from './corriger/corrigerCandidature.behavior';
import {
  applyCandidatureNotifiée,
  CandidatureNotifiéeEvent,
  CandidatureNotifiéeEventV1,
} from './notifier/notifierCandidature.behavior';
import { CandidatureNonTrouvéeError } from './candidatureNonTrouvée.error';
import { TypeActionnariat, TypeTechnologie } from './candidature';

export type CandidatureEvent =
  | CandidatureImportéeEvent
  | CandidatureCorrigéeEvent
  | CandidatureNotifiéeEvent
  | CandidatureNotifiéeEventV1;

type NonImporté = {
  importé?: undefined;
  statut?: StatutCandidature.ValueType;
};

type Importé = {
  importé: true;
  statut: StatutCandidature.ValueType;
};

export type CandidatureAggregate = Aggregate<CandidatureEvent> &
  (Importé | NonImporté) & {
    estNotifiée: boolean;
    notifiéeLe?: DateTime.ValueType;
    garantiesFinancières?: {
      type: TypeGarantiesFinancières.ValueType;
      dateEchéance?: DateTime.ValueType;
    };
    nomReprésentantLégal: string;
    sociétéMère: string;
    puissance: number;
    typeActionnariat?: TypeActionnariat.ValueType;
    nomProjet: string;
    localité: {
      adresse1: string;
      adresse2: string;
      codePostal: string;
      commune: string;
      région: string;
      département: string;
    };
    emailContact: Email.ValueType;
    prixRéférence: number;
    technologie: TypeTechnologie.ValueType;
    note: number;
  };

export const getDefaultCandidatureAggregate: GetDefaultAggregateState<
  CandidatureAggregate,
  CandidatureEvent
> = () => ({
  identifiantProjet: IdentifiantProjet.inconnu,
  nomProjet: '',
  localité: {
    adresse1: '',
    adresse2: '',
    codePostal: '',
    commune: '',
    région: '',
    département: '',
  },
  emailContact: Email.inconnu,
  prixRéférence: 0,
  puissance: 0,
  nomReprésentantLégal: '',
  sociétéMère: '',
  estNotifiée: false,
  note: 0,
  technologie: TypeTechnologie.nonApplicable,
  apply,
});

function apply(this: CandidatureAggregate, event: CandidatureEvent) {
  switch (event.type) {
    case 'CandidatureImportée-V1':
      applyCandidatureImportée.bind(this)(event);
      break;
    case 'CandidatureNotifiée-V1':
    case 'CandidatureNotifiée-V2':
      applyCandidatureNotifiée.bind(this)(event);
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
