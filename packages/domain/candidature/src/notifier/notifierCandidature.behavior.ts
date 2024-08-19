import { DomainEvent } from '@potentiel-domain/core';

import { CandidatureAggregate } from '../candidature.aggregate';

export type NotifierOptions = {};

export type LauréatNotifié = DomainEvent<'LauréatNotifié-V1', {}>;
export type ÉliminéNotifié = DomainEvent<'ÉliminéNotifié-V1', {}>;
export type CandidatureNotifiée = LauréatNotifié | ÉliminéNotifié;

export function notifier(this: CandidatureAggregate, _: NotifierOptions) {
  if (!this.importé) {
    throw new Error('TODO');
  }
}

export function applyLauréatNotifié(this: CandidatureAggregate, _event: LauréatNotifié) {
  this.notifié = true;
}

export function applyÉliminéNotifié(this: CandidatureAggregate, _event: ÉliminéNotifié) {
  this.notifié = true;
}
