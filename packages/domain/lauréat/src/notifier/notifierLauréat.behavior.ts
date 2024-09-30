import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { LauréatAggregate } from '../lauréat.aggregate';

export type NotifierOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  notifiéLe: DateTime.ValueType;
  notifiéPar: Email.ValueType;
  attestation: {
    format: string;
  };
};

export type LauréatNotifiéEvent = DomainEvent<
  'LauréatNotifié-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    notifiéLe: DateTime.RawType;
    notifiéPar: Email.RawType;

    attestation: {
      format: string;
    };
  }
>;

export async function notifier(
  this: LauréatAggregate,
  { identifiantProjet, notifiéLe, notifiéPar, attestation: { format } }: NotifierOptions,
) {
  const event: LauréatNotifiéEvent = {
    type: 'LauréatNotifié-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      notifiéLe: notifiéLe.formatter(),
      notifiéPar: notifiéPar.formatter(),
      attestation: {
        format,
      },
    },
  };

  await this.publish(event);
}

export function applyLauréatNotifié(this: LauréatAggregate, _event: LauréatNotifiéEvent) {}
