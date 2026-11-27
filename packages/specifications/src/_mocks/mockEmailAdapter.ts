import { type Middleware, mediator } from 'mediateur';

import {
  type EnvoyerNotificationEmailCommand,
  render,
} from '@potentiel-applications/notifications-email';
import { sendEmail } from '@potentiel-infrastructure/email';

import type { PotentielWorld } from '../potentiel.world.js';

export function createSendEmailTestAdapter(this: PotentielWorld) {
  const emailsEnabled = process.env.EMAILS_DISABLED_FOR_TESTS !== 'true';

  // sendEmail ne recoit pas les variables du template, mais le html de l'email.
  // On écoute donc les appels à EnvoyerNotificationCommand pour vérifier les variables.
  const middleware: Middleware = async (message, next) => {
    const emailMessage = message as EnvoyerNotificationEmailCommand;
    const { subject } = render(emailMessage.data);
    const { recipients, values } = emailMessage.data;

    this.notificationEmailWorld.ajouterNotificationEmail({
      subject: subject ?? 'pas de sujet',
      recipients: recipients.map((recipient) =>
        typeof recipient === 'string' ? { email: recipient } : recipient,
      ),
      values,
    });
    await next();
  };

  const messageType: EnvoyerNotificationEmailCommand['type'] = 'System.NotificationEmail.Envoyer';
  mediator.use({ messageType, middlewares: [middleware] });

  return emailsEnabled
    ? sendEmail
    : async () => {
        // noop
      };
}
