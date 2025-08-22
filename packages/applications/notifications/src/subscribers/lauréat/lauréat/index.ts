import { type Message, type MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';
import type { Event } from '@potentiel-infrastructure/pg-event-sourcing';

import type { SendEmail } from '../../../sendEmail';
import { cahierDesChargesChoisiNotification } from './cahierDesChargesChoisi.notification';

export type SubscriptionEvent = Lauréat.LauréatEvent & Event;

export type Execute = Message<'System.Notification.Lauréat', SubscriptionEvent>;

export type RegisterLauréatNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({ sendEmail }: RegisterLauréatNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    return await match(event)
      .with({ type: 'CahierDesChargesChoisi-V1' }, (event) =>
        cahierDesChargesChoisiNotification({ event, sendEmail }),
      )
      .otherwise(() => Promise.resolve());
  };

  mediator.register('System.Notification.Lauréat', handler);
};
