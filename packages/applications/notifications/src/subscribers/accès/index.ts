import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Accès } from '@potentiel-domain/projet';

import { EmailPayload, SendEmail } from '../../sendEmail';

import { accèsProjetRetiréNotification } from './accèsProjetRetiré.notification';

export type SubscriptionEvent = Accès.AccèsProjetRetiréEvent & Event;

export type Execute = Message<'System.Notification.Accès', SubscriptionEvent>;

export type RegisterUtilisateurNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({ sendEmail }: RegisterUtilisateurNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    const emailPayloads = await match(event)
      .returnType<Promise<EmailPayload[]>>()
      .with({ type: 'AccèsProjetRetiré-V1' }, accèsProjetRetiréNotification)
      .exhaustive();

    await Promise.all(emailPayloads.map(sendEmail));
  };

  mediator.register('System.Notification.Accès', handler);
};
