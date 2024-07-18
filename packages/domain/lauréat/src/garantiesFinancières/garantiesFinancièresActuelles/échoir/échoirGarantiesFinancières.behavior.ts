import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent, InvalidOperationError } from '@potentiel-domain/core';

import { StatutGarantiesFinancières } from '../..';
import { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';
import { AucunesGarantiesFinancièresValidéesError } from '../aucunesGarantiesFinancièresValidéesError';

export type GarantiesFinancièresÉchuesEvent = DomainEvent<
  'GarantiesFinancièresÉchues-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    dateÉchéance: DateTime.RawType;
    échuLe: DateTime.RawType;
  }
>;

export type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
  dateÉchéance: DateTime.ValueType;
  échuLe: DateTime.ValueType;
};

export async function échoir(
  this: GarantiesFinancièresAggregate,
  { identifiantProjet, dateÉchéance, échuLe }: Options,
) {
  if (!this.actuelles) {
    throw new AucunesGarantiesFinancièresValidéesError();
  }

  if (échuLe.estAntérieurÀ(dateÉchéance)) {
    throw new DateÉchéanceNonPasséeError();
  }

  if (échuLe.estÉgaleÀ(dateÉchéance)) {
    throw new DateÉchéanceNonPasséeError();
  }

  const event: GarantiesFinancièresÉchuesEvent = {
    type: 'GarantiesFinancièresÉchues-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      dateÉchéance: dateÉchéance?.formatter(),
      échuLe: échuLe.formatter(),
    },
  };

  await this.publish(event);
}

export function applyGarantiesFinancièresÉchues(this: GarantiesFinancièresAggregate) {
  if (this.actuelles) {
    this.actuelles.statut = StatutGarantiesFinancières.échu;
  }
}

class DateÉchéanceNonPasséeError extends InvalidOperationError {
  constructor() {
    super(`La date d'échéance des garanties financières n'est pas encore passée`);
  }
}
