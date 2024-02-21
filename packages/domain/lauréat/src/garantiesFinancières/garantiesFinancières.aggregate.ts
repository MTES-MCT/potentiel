import { Aggregate, GetDefaultAggregateState, LoadAggregate } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import {
  GarantiesFinancièresSoumisesEvent,
  applyGarantiesFinancièresSoumises,
  soumettre,
} from './soumettre/soumettreGarantiesFinancières.behavior';
import { TypeGarantiesFinancières } from '.';
import { AucunesGarantiesFinancières } from './aucunesGarantiesFinancières.error';
import {
  GarantiesFinancièresEnAttenteNotifiéEvent,
  applyNotifierGarantiesFinancièresEnAttente,
  notifierGarantiesFinancièresEnAttente,
} from './notifierGarantiesFinancièresEnAttente/notifierGarantiesFinancièresEnAttente.behavior';

export type GarantiesFinancièresEvent =
  | GarantiesFinancièresSoumisesEvent
  | GarantiesFinancièresEnAttenteNotifiéEvent;

export type GarantiesFinancièresAggregate = Aggregate<GarantiesFinancièresEvent> & {
  validées?: {
    type: TypeGarantiesFinancières.ValueType;
    dateÉchéance?: DateTime.ValueType;
    dateConstitution: DateTime.ValueType;
    validéLe: DateTime.ValueType;
  };
  àTraiter?: {
    type: TypeGarantiesFinancières.ValueType;
    dateÉchéance?: DateTime.ValueType;
    dateConstitution: DateTime.ValueType;
    soumisLe: DateTime.ValueType;
  };
  enAttente?: { dateLimiteSoumission: DateTime.ValueType };
  readonly soumettre: typeof soumettre;
  readonly notifierGarantiesFinancièresEnAttente: typeof notifierGarantiesFinancièresEnAttente;
};

export const getDefaultGarantiesFinancièresAggregate: GetDefaultAggregateState<
  GarantiesFinancièresAggregate,
  GarantiesFinancièresEvent
> = () => ({
  apply,
  soumettre,
  notifierGarantiesFinancièresEnAttente,
});

function apply(this: GarantiesFinancièresAggregate, event: GarantiesFinancièresEvent) {
  switch (event.type) {
    case 'GarantiesFinancièresSoumises-V1':
      applyGarantiesFinancièresSoumises.bind(this)(event);
      break;
    case 'GarantiesFinancièresEnAttenteNotifié-V1':
      applyNotifierGarantiesFinancièresEnAttente.bind(this)(event);
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
