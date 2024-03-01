import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { GarantiesFinancièresAggregate } from '../garantiesFinancières.aggregate';
import { StatutGarantiesFinancières } from '..';

export type GarantiesFinancièresDemandéesEvent = DomainEvent<
  'GarantiesFinancièresDemandées-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    dateLimiteSoumission: DateTime.RawType;
    demandéLe: DateTime.RawType;
  }
>;

export type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
  dateLimiteSoumission: DateTime.ValueType;
  demandéLe: DateTime.ValueType;
};

export async function demanderGarantiesFinancières(
  this: GarantiesFinancièresAggregate,
  { dateLimiteSoumission, identifiantProjet, demandéLe }: Options,
) {
  const event: GarantiesFinancièresDemandéesEvent = {
    type: 'GarantiesFinancièresDemandées-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      dateLimiteSoumission: dateLimiteSoumission.formatter(),
      demandéLe: demandéLe.formatter(),
    },
  };

  await this.publish(event);
}

export function applyGarantiesFinancièresDemandées(
  this: GarantiesFinancièresAggregate,
  { payload: { dateLimiteSoumission } }: GarantiesFinancièresDemandéesEvent,
) {
  this.statut = StatutGarantiesFinancières.enAttente;
  this.enAttente = {
    dateLimiteSoumission: DateTime.convertirEnValueType(dateLimiteSoumission),
  };
}
