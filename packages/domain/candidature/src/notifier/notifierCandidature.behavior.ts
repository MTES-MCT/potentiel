import { DomainEvent } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { CandidatureAggregate } from '../candidature.aggregate';

export type NotifierOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
};

type CommonPayload = {
  identifiantProjet: IdentifiantProjet.RawType;
};
export type LauréatNotifié = DomainEvent<'LauréatNotifié-V1', CommonPayload & {}>;
export type ÉliminéNotifié = DomainEvent<'ÉliminéNotifié-V1', CommonPayload & {}>;
export type CandidatureNotifiée = LauréatNotifié | ÉliminéNotifié;

export async function notifier(this: CandidatureAggregate, { identifiantProjet }: NotifierOptions) {
  if (!this.importé) {
    throw new Error('TODO');
  }
  if (!this.statut) {
    // TODO corriger le type de l'aggregate pour que ceci soit impossible
    throw new Error('TODO statut');
  }
  const commonPayload: CommonPayload = {
    identifiantProjet: identifiantProjet.formatter(),
  };

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
