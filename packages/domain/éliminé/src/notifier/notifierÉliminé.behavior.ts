import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { ÉliminéAggregate } from '../éliminé.aggregate';

export type NotifierOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  notifiéLe: DateTime.ValueType;
  notifiéPar: Email.ValueType;
  attestation: {
    format: string;
  };
};

export type ÉliminéNotifié = DomainEvent<
  'ÉliminéNotifié-V1',
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
  this: ÉliminéAggregate,
  { identifiantProjet, notifiéLe, notifiéPar, attestation }: NotifierOptions,
) {
  const event: ÉliminéNotifié = {
    type: 'ÉliminéNotifié-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      notifiéLe: notifiéLe.formatter(),
      notifiéPar: notifiéPar.formatter(),
      attestation: {
        format: attestation.format,
      },
    },
  };

  await this.publish(event);
}

export function applyÉliminéNotifié(this: ÉliminéAggregate, _event: ÉliminéNotifié) {
  this.estNotifié = true;
}
