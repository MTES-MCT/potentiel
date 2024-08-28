import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { ÉliminéAggregate } from '../éliminé.aggregate';

export type NotifierOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  dateNotification: DateTime.ValueType;
  attestationSignée: DocumentProjet.ValueType;
};

export type ÉliminéNotifié = DomainEvent<
  'ÉliminéNotifié-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    dateNotification: DateTime.RawType;
    attestationSignée: {
      format: string;
    };
  }
>;

export async function notifier(
  this: ÉliminéAggregate,
  { identifiantProjet, dateNotification, attestationSignée }: NotifierOptions,
) {
  const event: ÉliminéNotifié = {
    type: 'ÉliminéNotifié-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      dateNotification: dateNotification.formatter(),
      attestationSignée: {
        format: attestationSignée.format,
      },
    },
  };

  await this.publish(event);
}

export function applyÉliminéNotifié(this: ÉliminéAggregate, _event: ÉliminéNotifié) {
  this.notifié = true;
}
