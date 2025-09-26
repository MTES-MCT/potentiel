import { assert } from 'chai';

import { EmailPayload } from '@potentiel-applications/notifications';
import { Email } from '@potentiel-domain/common';

export class NotificationWorld {
  #notifications: EmailPayload[] = [];

  ajouterNotification(notification: EmailPayload) {
    this.#notifications.push(notification);
  }

  récupérerNotification(emailValue: string, sujet?: string) {
    const email = Email.convertirEnValueType(emailValue);
    const notif = this.#notifications.find((notif) => {
      if (sujet && !notif.messageSubject.match(new RegExp(sujet))) {
        return false;
      }
      const allRecipients = [...notif.recipients, ...(notif.cc ?? []), ...(notif.bcc ?? [])];
      return allRecipients.some((r) => Email.convertirEnValueType(r.email).estÉgaleÀ(email));
    });
    if (!notif) {
      console.log(
        { sujet, emailValue },
        this.#notifications.map((x) => ({
          sujet: x.messageSubject,
          recipients: [...x.recipients, ...(x.cc ?? []), ...(x.bcc ?? [])].map((r) => r.email),
        })),
      );
    }
    assert(notif, 'Pas de notification');
    return notif;
  }

  récupérerDestinataires(sujet: string) {
    return this.#notifications.filter((notif) => notif.messageSubject.match(new RegExp(sujet)));
  }
}
