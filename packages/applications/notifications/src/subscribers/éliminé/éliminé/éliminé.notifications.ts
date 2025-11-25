import { mediator, Message, MessageHandler } from 'mediateur';
import { match } from 'ts-pattern';

import { Éliminé } from '@potentiel-domain/projet';

import { SendEmail } from '#sendEmail';

import { handleÉliminéNotifié } from './handlers/éliminéNotifié.handler.js';

export type SubscriptionEvent = Éliminé.ÉliminéNotifiéEvent;

export type Execute = Message<'System.Notification.Éliminé', SubscriptionEvent>;

export type RegisterÉliminéNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({ sendEmail }: RegisterÉliminéNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    return await match(event)
      .with({ type: 'ÉliminéNotifié-V1' }, (event) => handleÉliminéNotifié({ sendEmail, event }))
      .exhaustive();
  };

  mediator.register('System.Notification.Éliminé', handler);
};
