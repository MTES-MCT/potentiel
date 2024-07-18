import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { StatutGarantiesFinancières } from '../..';
import { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';

export type GarantiesFinancièresÉchuesEvent = DomainEvent<
  'GarantiesFinancièresÉchues-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    dateÉchéance: DateTime.RawType;
    échuLe: DateTime.RawType;
    échuPar: Email.RawType;
  }
>;

export type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
  dateÉchéance: DateTime.ValueType;
  échuLe: DateTime.ValueType;
  échuPar: Email.ValueType;
};

export async function échoir(
  this: GarantiesFinancièresAggregate,
  { identifiantProjet, dateÉchéance, échuLe, échuPar }: Options,
) {
  const event: GarantiesFinancièresÉchuesEvent = {
    type: 'GarantiesFinancièresÉchues-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      dateÉchéance: dateÉchéance?.formatter(),
      échuLe: échuLe.formatter(),
      échuPar: échuPar.formatter(),
    },
  };

  await this.publish(event);
}

export function applyGarantiesFinancièresÉchues(this: GarantiesFinancièresAggregate) {
  if (this.actuelles) {
    this.actuelles.statut = StatutGarantiesFinancières.échu;
  }
}
