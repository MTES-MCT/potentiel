import { MessageResult, Message, Middleware, mediator } from 'mediateur';

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

// sendEmailV2 ne recoit pas les variables du template, mais le html de l'email.
// On écoute donc les appels à EnvoyerNotificationCommand pour vérifier les variables.
export function addEmailSpyMiddleware(this: PotentielWorld) {
  const middleware: Middleware = async (message, next) => {
    const emailMessage = message as EnvoyerNotificationCommand;

    const { subject } = render(emailMessage.data);
    const { recipients, values } = emailMessage.data;

    this.notificationWorld.ajouterNotification({
      templateId: -1,
      messageSubject: subject ?? 'pas de sujet',
      recipients: recipients.map((recipient: string | { email: string }) =>
        typeof recipient === 'string' ? { email: recipient } : recipient,
      ),
      variables: values,
    });

    return await next();
  };

  const messageType: EnvoyerNotificationCommand['type'] = 'System.Notification.Envoyer';
  mediator.use({ messageType, middlewares: [middleware] });
}
