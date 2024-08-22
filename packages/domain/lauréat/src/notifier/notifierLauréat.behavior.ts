import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { LauréatAggregate } from '../lauréat.aggregate';

export type NotifierOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  dateNotification: DateTime.ValueType;
};

export type LauréatNotifié = DomainEvent<
  'LauréatNotifié-V1',
  { identifiantProjet: IdentifiantProjet.RawType; dateNotification: DateTime.RawType }
>;

export async function notifier(
  this: LauréatAggregate,
  { identifiantProjet, dateNotification }: NotifierOptions,
) {
  await générerAttestation();

  const event: LauréatNotifié = {
    type: 'LauréatNotifié-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      dateNotification: dateNotification.formatter(),
    },
  };

  await this.publish(event);
}

export function applyLauréatNotifié(this: LauréatAggregate, _event: LauréatNotifié) {
  this.notifié = true;
}

async function générerAttestation() {}
