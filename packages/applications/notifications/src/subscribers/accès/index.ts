import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Accès } from '@potentiel-domain/projet';

import { EmailPayload, SendEmail } from '../../sendEmail';

import { accèsProjetRetiréNotification } from './accèsProjetRetiré.notification';
import { accèsProjetAutoriséSuiteÀRéclamationNotification } from './accèsProjetAutoriséSuiteÀRéclamation.notification';

export type SubscriptionEvent = Accès.AccèsEvent & Event;

export type Execute = Message<'System.Notification.Accès', SubscriptionEvent>;

export type RegisterUtilisateurNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({ sendEmail }: RegisterUtilisateurNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    const emailPayloads = await match(event)
      .returnType<Promise<EmailPayload[]>>()
      .with({ type: 'AccèsProjetRetiré-V1' }, accèsProjetRetiréNotification)
      .with(
        {
          type: 'AccèsProjetAutorisé-V1',
          payload: {
            raison: 'réclamation',
          },
        },
        accèsProjetAutoriséSuiteÀRéclamationNotification,
      )
      .otherwise(() => Promise.resolve([]));

    await Promise.all(emailPayloads.map(sendEmail));
  };

  mediator.register('System.Notification.Accès', handler);
};
