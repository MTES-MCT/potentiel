import { Middleware, mediator } from 'mediateur';

import { EnvoyerNotificationCommand, render } from '@potentiel-applications/notifications';

import { PotentielWorld } from '../potentiel.world.js';

// sendEmail ne recoit pas les variables du template, mais le html de l'email.
// On écoute donc les appels à EnvoyerNotificationCommand pour vérifier les variables.
export function addEmailSpyMiddleware(this: PotentielWorld) {
  const middleware: Middleware = async (message, next) => {
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

    return await next();
  };

  const messageType: EnvoyerNotificationCommand['type'] = 'System.Notification.Envoyer';
  mediator.use({ messageType, middlewares: [middleware] });
}
