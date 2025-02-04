import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { ÉliminéAggregate } from '../éliminé.aggregate';
import { IdentifiantProjet } from '../..';

export type NotifierOptions = {
  notifiéLe: DateTime.ValueType;
  notifiéPar: Email.ValueType;
  attestation: {
    format: string;
  };
};

export type ÉliminéNotifiéEvent = DomainEvent<
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
  { notifiéLe, notifiéPar, attestation }: NotifierOptions,
) {
  const event: ÉliminéNotifiéEvent = {
    type: 'ÉliminéNotifié-V1',
    payload: {
      identifiantProjet: this.projet.identifiant.formatter(),
      notifiéLe: notifiéLe.formatter(),
      notifiéPar: notifiéPar.formatter(),
      attestation: {
        format: attestation.format,
      },
    },
  };

  await this.publish(event);
}

export function applyÉliminéNotifié(
  this: ÉliminéAggregate,
  { payload: { identifiantProjet } }: ÉliminéNotifiéEvent,
) {
  this.identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjet);
}
