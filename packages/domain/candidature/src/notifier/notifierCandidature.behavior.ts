import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { CandidatureAggregate } from '../candidature.aggregate';

export type NotifierOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  dateNotification: DateTime.ValueType;
};

type CommonPayload = {
  identifiantProjet: IdentifiantProjet.RawType;
  dateNotification: DateTime.RawType;
};
export type LauréatNotifié = DomainEvent<'LauréatNotifié-V1', CommonPayload & {}>;
export type ÉliminéNotifié = DomainEvent<'ÉliminéNotifié-V1', CommonPayload & {}>;
export type CandidatureNotifiée = LauréatNotifié | ÉliminéNotifié;

export async function notifier(
  this: CandidatureAggregate,
  { identifiantProjet, dateNotification }: NotifierOptions,
) {
  if (!this.importé) {
    throw new Error('TODO');
  }
  if (!this.statut) {
    // TODO corriger le type de l'aggregate pour que ceci soit impossible
    throw new Error('TODO statut');
  }
  const commonPayload: CommonPayload = {
    identifiantProjet: identifiantProjet.formatter(),
    dateNotification: dateNotification.formatter(),
  };

  await générerAttestation();

  const event: CandidatureNotifiée = this.statut.estClassé()
    ? {
        type: 'LauréatNotifié-V1',
        payload: {
          ...commonPayload,
        },
      }
    : {
        type: 'ÉliminéNotifié-V1',
        payload: {
          ...commonPayload,
        },
      };

  await this.publish(event);
}

export function applyLauréatNotifié(this: CandidatureAggregate, _event: LauréatNotifié) {
  this.notifié = true;
}

export function applyÉliminéNotifié(this: CandidatureAggregate, _event: ÉliminéNotifié) {
  this.notifié = true;
}

async function générerAttestation() {}
