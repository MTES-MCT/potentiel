import { Middleware, mediator } from 'mediateur';

import { EnvoyerNotificationCommand, render } from '@potentiel-applications/notifications';
import { EmailOptions, sendEmail } from '@potentiel-infrastructure/email';

import { PotentielWorld } from '../potentiel.world.js';

export function createSendEmailTestAdapter(this: PotentielWorld) {
  let emailsEnabled = false;

  // sendEmail ne recoit pas les variables du template, mais le html de l'email.
  // On écoute donc les appels à EnvoyerNotificationCommand pour vérifier les variables.
  const middleware: Middleware = async (message, next) => {
    if (!emailsEnabled) {
      return;
    }

    const emailMessage = message as EnvoyerNotificationCommand;
    const { subject } = render(emailMessage.data);
    const { recipients, values } = emailMessage.data;

    this.notificationWorld.ajouterNotification({
      subject: subject ?? 'pas de sujet',
      recipients: recipients.map((recipient) =>
        typeof recipient === 'string' ? { email: recipient } : recipient,
      ),
      values,
    });
    await next();
  };

  const messageType: EnvoyerNotificationCommand['type'] = 'System.Notification.Envoyer';
  mediator.use({ messageType, middlewares: [middleware] });

  return {
    enableEmails: async () => {
      emailsEnabled = true;
    },
    sendEmail: async ({ content, subject, recipients }: EmailOptions) => {
      if (emailsEnabled) {
        return sendEmail({ content, subject, recipients });
      }
    },
  };
}
