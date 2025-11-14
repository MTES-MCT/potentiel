import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Période } from '@potentiel-domain/periode';

import { SendEmail } from '@/sendEmail';

import { handlePériodeNotifiée } from './handlers';

export type SubscriptionEvent = Période.PériodeEvent;

export type Execute = Message<'System.Notification.Période', SubscriptionEvent>;

type RegisterPériodeNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({ sendEmail }: RegisterPériodeNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) =>
    match(event)
      .with({ type: 'PériodeNotifiée-V1' }, (event) => handlePériodeNotifiée({ event, sendEmail }))
      .exhaustive();

  mediator.register('System.Notification.Période', handler);
};
