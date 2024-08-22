import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { ÉliminéAggregate } from '../éliminé.aggregate';

export type NotifierOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  dateNotification: DateTime.ValueType;
};

export type ÉliminéNotifié = DomainEvent<
  'ÉliminéNotifié-V1',
  { identifiantProjet: IdentifiantProjet.RawType; dateNotification: DateTime.RawType }
>;

export async function notifier(
  this: ÉliminéAggregate,
  { identifiantProjet, dateNotification }: NotifierOptions,
) {
  await générerAttestation();

  const event: ÉliminéNotifié = {
    type: 'ÉliminéNotifié-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      dateNotification: dateNotification.formatter(),
    },
  };

  await this.publish(event);
}

export function applyÉliminéNotifié(this: ÉliminéAggregate, _event: ÉliminéNotifié) {
  this.notifié = true;
}

async function générerAttestation() {}
