import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Candidature } from '@potentiel-domain/projet';

import { handleCandidatureCorrigée } from './handlers/index.js';

export type SubscriptionEvent = Candidature.CandidatureCorrigéeEvent;

export type Execute = Message<'System.Notification.Candidature', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) =>
    match(event).with({ type: 'CandidatureCorrigée-V2' }, handleCandidatureCorrigée).exhaustive();

  mediator.register('System.Notification.Candidature', handler);
};
