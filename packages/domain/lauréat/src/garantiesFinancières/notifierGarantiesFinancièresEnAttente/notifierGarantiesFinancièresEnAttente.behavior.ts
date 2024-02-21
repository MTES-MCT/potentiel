import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { GarantiesFinancièresAggregate } from '../garantiesFinancières.aggregate';

export type GarantiesFinancièresEnAttenteNotifiéEvent = DomainEvent<
  'GarantiesFinancièresEnAttenteNotifié-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    dateLimiteSoumission: DateTime.RawType;
    notifiéLe: DateTime.RawType;
  }
>;

export type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
  dateLimiteSoumission: DateTime.ValueType;
  notifiéLe: DateTime.ValueType;
};

export async function notifierGarantiesFinancièresEnAttente(
  this: GarantiesFinancièresAggregate,
  { dateLimiteSoumission, identifiantProjet, notifiéLe }: Options,
) {
  const event: GarantiesFinancièresEnAttenteNotifiéEvent = {
    type: 'GarantiesFinancièresEnAttenteNotifié-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      dateLimiteSoumission: dateLimiteSoumission.formatter(),
      notifiéLe: notifiéLe.formatter(),
    },
  };

  await this.publish(event);
}

export function applyNotifierGarantiesFinancièresEnAttente(
  this: GarantiesFinancièresAggregate,
  { payload: { dateLimiteSoumission } }: GarantiesFinancièresEnAttenteNotifiéEvent,
) {
  this.enAttente = {
    dateLimiteSoumission: DateTime.convertirEnValueType(dateLimiteSoumission),
  };
}
