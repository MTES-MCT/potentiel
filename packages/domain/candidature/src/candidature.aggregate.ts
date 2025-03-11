// FIXME the import should be node:crypto but this breaks NextJS
import { createHash } from 'crypto';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Aggregate, GetDefaultAggregateState, LoadAggregate } from '@potentiel-domain/core';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import * as StatutCandidature from './statutCandidature.valueType';
import * as TypeGarantiesFinancières from './typeGarantiesFinancières.valueType';
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
import {
  applyCandidatureNotifiée,
  CandidatureNotifiéeEvent,
  CandidatureNotifiéeEventV1,
  notifier,
} from './notifier/notifierCandidature.behavior';
import { CandidatureNonTrouvéeError } from './candidatureNonTrouvée.error';
import { TypeActionnariat } from './candidature';

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
    payloadHash: string;
    nomReprésentantLégal: string;
    sociétéMère: string;
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
    importer: typeof importer;
    corriger: typeof corriger;
    notifier: typeof notifier;
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

const getDeepKeys = (obj: object): string[] => {
  return Object.entries(obj).reduce<string[]>((r, [key, value]) => {
    r.push(key);
    if (typeof value === 'object' && value !== null) {
      r.push(...getDeepKeys(value));
    }
    return r;
  }, []);
};

export const getDefaultCandidatureAggregate: GetDefaultAggregateState<
  CandidatureAggregate,
  CandidatureEvent
> = () => ({
  identifiantProjet: IdentifiantProjet.inconnu,
  payloadHash: '',
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
  nomReprésentantLégal: '',
  sociétéMère: '',
  estNotifiée: false,
  apply,
  importer,
  corriger,
  notifier,
  calculerHash(payload) {
    const copy = { ...payload } as Partial<
      CandidatureImportéeEvent['payload'] & CandidatureCorrigéeEvent['payload']
    >;
    delete copy.corrigéLe;
    delete copy.corrigéPar;
    delete copy.importéLe;
    delete copy.importéPar;
    delete copy.doitRégénérerAttestation;
    delete copy.détailsMisÀJour;

    return createHash('md5')
      .update(JSON.stringify(copy, getDeepKeys(copy).sort()))
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
