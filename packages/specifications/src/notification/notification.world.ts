import { assert } from 'chai';

import { EmailPayload } from '@potentiel-applications/notifications';
import { Email } from '@potentiel-domain/common';

export class NotificationWorld {
  #notifications: EmailPayload[] = [];

  ajouterNotification(notification: EmailPayload) {
    for (const recipient of notification.recipients) {
      const notificationToAdd = {
        ...notification,
        recipients: [recipient],
      };
      this.#notifications.push(notificationToAdd);
    }
  }

  récupérerNotification(emailValue: string, sujet?: string) {
    const email = Email.convertirEnValueType(emailValue);
    const notif = this.#notifications.find(
      (notif) =>
        notif.recipients.find((r) => Email.convertirEnValueType(r.email).estÉgaleÀ(email)) &&
        (!sujet || notif.messageSubject.match(new RegExp(sujet))),
    );
    assert(notif, 'Pas de notification');
    return notif;
  }
}
