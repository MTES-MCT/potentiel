import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../..';
import { LauréatAggregate } from '../lauréat.aggregate';
import { nonNotifié } from '../../statutProjet.valueType';

export type NotifierOptions = {
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
  { notifiéLe, notifiéPar, attestation: { format } }: NotifierOptions,
) {
  if (this.projet.statut.estÉgaleÀ(nonNotifié)) {
    const event: LauréatNotifiéEvent = {
      type: 'LauréatNotifié-V1',
      payload: {
        identifiantProjet: this.projet.identifiant.formatter(),
        notifiéLe: notifiéLe.formatter(),
        notifiéPar: notifiéPar.formatter(),
        attestation: {
          format,
        },
      },
    };
    await this.publish(event);
  }
}

export function applyLauréatNotifié(
  this: LauréatAggregate,
  { payload: { notifiéLe } }: LauréatNotifiéEvent,
) {
  this.notifiéLe = DateTime.convertirEnValueType(notifiéLe);
}
