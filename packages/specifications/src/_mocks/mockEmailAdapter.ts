import { MessageResult, Message, Middleware } from 'mediateur';

import {
  EmailPayload,
  EnvoyerNotificationCommand,
  render,
} from '@potentiel-applications/notifications';

import { PotentielWorld } from '../potentiel.world';

export async function mockEmailAdapter(
  this: PotentielWorld,
  emailPayload: EmailPayload,
): Promise<MessageResult<Message>> {
  this.notificationWorld.ajouterNotification(emailPayload);
}

export function createEmailMiddleware(this: PotentielWorld): Middleware {
  return async (message, next) => {
    const emailMessage = message as EnvoyerNotificationCommand;
    if (emailMessage.type === 'System.Notification.Envoyer') {
      const { subject } = render(emailMessage.data);
      const { recipients, values } = emailMessage.data;

      this.notificationWorld.ajouterNotification({
        templateId: -1,
        messageSubject: subject ?? 'pas de sujet',
        recipients: recipients.map((recipient) =>
          typeof recipient === 'string' ? { email: recipient } : recipient,
        ),
        variables: values,
      });
    }

    return await next();
  };
}
