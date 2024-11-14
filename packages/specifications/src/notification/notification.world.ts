import { assert } from 'chai';

import { EmailPayload } from '@potentiel-applications/notifications';

export class NotificationWorld {
  #notifications: EmailPayload[] = [];

  ajouterNotification(notification: EmailPayload) {
    this.#notifications.push(notification);
  }

  récupérerNotification(email: string, sujet?: string) {
    const notif = this.#notifications.find(
      (notif) =>
        notif.recipients.find((r) => r.email === email) &&
        (!sujet || notif.messageSubject.match(new RegExp(sujet))),
    );
    assert(notif, 'Pas de notification');
    return notif;
  }
}
