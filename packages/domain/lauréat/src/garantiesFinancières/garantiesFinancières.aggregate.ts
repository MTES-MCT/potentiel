import { Aggregate, GetDefaultAggregateState, LoadAggregate } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import {
  GarantiesFinancièresSoumisesEvent,
  applyGarantiesFinancièresSoumises,
  soumettre,
} from './soumettre/soumettreGarantiesFinancières.behavior';
import { StatutGarantiesFinancières, TypeGarantiesFinancières } from '.';
import { AucunesGarantiesFinancières } from './aucunesGarantiesFinancières.error';
import {
  GarantiesFinancièresDemandéesEvent,
  applyGarantiesFinancièresDemandées,
  demanderGarantiesFinancières,
} from './demander/demanderGarantiesFinancières.behavior';
import {
  GarantiesFinancièresÀTraiterSuppriméesEvent,
  applyGarantiesFinancièresÀTraiterSupprimées,
  supprimerGarantiesFinancièresÀTraiter,
} from './supprimerGarantiesFinancièresÀTraiter/supprimerGarantiesFinancièresÀTraiter.behavior';
import {
  GarantiesFinancièresValidéesEvent,
  applyGarantiesFinancièresValidées,
  valider,
} from './valider/validerGarantiesFinancières.behavior';
import {
  GarantiesFinancièresÀTraiterModifiéesEvent,
  applyModifierGarantiesFinancièresÀTraiter,
  modifierGarantiesFinancièresÀTraiter,
} from './modifierGarantiesFinancièresÀTraiter/modifierGarantiesFinancièresÀTraiter.behavior';
import {
  TypeGarantiesFinancièresImportéEvent,
  applyTypeGarantiesFinancièresImporté,
  importerType,
} from './importer/importerTypeGarantiesFinancières.behavior';
import {
  GarantiesFinancièresComplétéesEvent,
  applyCompléterGarantiesFinancières,
  compléter,
} from './compléter/compléterGarantiesFinancières.behavior';

export type GarantiesFinancièresEvent =
  | GarantiesFinancièresSoumisesEvent
  | GarantiesFinancièresDemandéesEvent
  | GarantiesFinancièresÀTraiterSuppriméesEvent
  | GarantiesFinancièresValidéesEvent
  | GarantiesFinancièresÀTraiterModifiéesEvent
  | TypeGarantiesFinancièresImportéEvent
  | GarantiesFinancièresComplétéesEvent;

export type GarantiesFinancièresAggregate = Aggregate<GarantiesFinancièresEvent> & {
  statut?: StatutGarantiesFinancières.ValueType;
  validées?: {
    type: TypeGarantiesFinancières.ValueType | 'type-inconnu';
    dateÉchéance?: DateTime.ValueType;
    dateConstitution?: DateTime.ValueType;
    validéLe?: DateTime.ValueType;
    importéLe?: DateTime.ValueType;
  };
  àTraiter?: {
    type: TypeGarantiesFinancières.ValueType | 'type-inconnu';
    dateÉchéance?: DateTime.ValueType;
    dateConstitution: DateTime.ValueType;
    soumisLe: DateTime.ValueType;
  };
  enAttente?: { dateLimiteSoumission: DateTime.ValueType };
  readonly soumettre: typeof soumettre;
  readonly demanderGarantiesFinancières: typeof demanderGarantiesFinancières;
  readonly supprimerGarantiesFinancièresÀTraiter: typeof supprimerGarantiesFinancièresÀTraiter;
  readonly valider: typeof valider;
  readonly modifierGarantiesFinancièresÀTraiter: typeof modifierGarantiesFinancièresÀTraiter;
  readonly importerType: typeof importerType;
  readonly compléter: typeof compléter;
};

export const getDefaultGarantiesFinancièresAggregate: GetDefaultAggregateState<
  GarantiesFinancièresAggregate,
  GarantiesFinancièresEvent
> = () => ({
  apply,
  soumettre,
  demanderGarantiesFinancières,
  supprimerGarantiesFinancièresÀTraiter,
  valider,
  modifierGarantiesFinancièresÀTraiter,
  importerType,
  compléter,
});

function apply(this: GarantiesFinancièresAggregate, event: GarantiesFinancièresEvent) {
  switch (event.type) {
    case 'GarantiesFinancièresSoumises-V1':
      applyGarantiesFinancièresSoumises.bind(this)(event);
      break;
    case 'GarantiesFinancièresDemandées-V1':
      applyGarantiesFinancièresDemandées.bind(this)(event);
      break;
    case 'GarantiesFinancièresÀTraiterSupprimées-V1':
      applyGarantiesFinancièresÀTraiterSupprimées.bind(this)();
      break;
    case 'GarantiesFinancièresValidées-V1':
      applyGarantiesFinancièresValidées.bind(this)(event);
      break;
    case 'GarantiesFinancièresÀTraiterModifiées-V1':
      applyModifierGarantiesFinancièresÀTraiter.bind(this)(event);
      break;
    case 'TypeGarantiesFinancièresImporté-V1':
      applyTypeGarantiesFinancièresImporté.bind(this)(event);
      break;
    case 'GarantiesFinancièresComplétées-V1':
      applyCompléterGarantiesFinancières.bind(this)(event);
      break;
  }
}

export const loadGarantiesFinancièresFactory =
  (loadAggregate: LoadAggregate) =>
  (identifiantProjet: IdentifiantProjet.ValueType, throwOnNone = true) => {
    return loadAggregate({
      aggregateId: `garanties-financieres|${identifiantProjet.formatter()}`,
      getDefaultAggregate: getDefaultGarantiesFinancièresAggregate,
      onNone: throwOnNone
        ? () => {
            throw new AucunesGarantiesFinancières();
          }
        : undefined,
    });
  };
