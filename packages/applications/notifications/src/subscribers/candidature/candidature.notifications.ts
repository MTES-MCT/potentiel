import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Candidature } from '@potentiel-domain/projet';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';

import { SendEmail } from '../../sendEmail';

import { handleCandidatureCorrigée } from './handlers';

export type SubscriptionEvent = Candidature.CandidatureCorrigéeEvent & Event;

export type Execute = Message<'System.Notification.Candidature', SubscriptionEvent>;

export type RegisterCandidatureNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({ sendEmail }: RegisterCandidatureNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) =>
    match(event)
      .with({ type: 'CandidatureCorrigée-V2' }, (event) =>
        handleCandidatureCorrigée({ sendEmail, event }),
      )
      .exhaustive();

  mediator.register('System.Notification.Candidature', handler);
};
