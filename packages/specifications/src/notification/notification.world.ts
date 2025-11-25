import { assert, expect } from 'chai';

import { EmailPayload } from '@potentiel-applications/notifications';
import { Email } from '@potentiel-domain/common';
import { getLogger } from '@potentiel-libraries/monitoring';

export class NotificationWorld {
  #notifications: (Pick<EmailPayload, 'variables' | 'messageSubject'> & {
    email: Email.ValueType;
    checked?: true;
  })[] = [];

  ajouterNotification(notif: EmailPayload) {
    for (const recipient of [...notif.recipients, ...(notif.cc ?? []), ...(notif.bcc ?? [])]) {
      this.#notifications.push({
        ...notif,
        email: Email.convertirEnValueType(recipient.email),
      });
    }
  }

  récupérerNotification(emailValue: string, sujet?: string) {
    const email = Email.convertirEnValueType(emailValue);
    const notif = this.#notifications.find((notif) => {
      if (notif.checked) {
        return false;
      }
      if (sujet && !notif.messageSubject.match(new RegExp(sujet))) {
        return false;
      }
      return notif.email.estÉgaleÀ(email);
    });
    if (!notif) {
      getLogger('NotificationWorld').debug(`Aucune notification trouvée`, {
        sujet,
        emailValue,
        notificationsEnvoyées: this.#notifications.map((x) => ({
          sujet: x.messageSubject,
          recipients: x.email,
        })),
      });
    }
    assert(notif, 'Pas de notification');

    notif.checked = true;
    return notif;
  }

  resetNotifications() {
    this.#notifications = [];
  }

  vérifierAucunEmailsEnvoyés(emailValue: string) {
    const email = Email.convertirEnValueType(emailValue);
    const notif = this.#notifications.find((notif) => notif.email.estÉgaleÀ(email));
    expect(notif, `Des emails ont été envoyés`).to.be.undefined;
  }

  vérifierToutesNotificationsPointées() {
    expect(
      this.#notifications
        .filter((notif) => !notif.checked)
        .map((notif) => ({ email: notif.email, subject: notif.messageSubject })),
      `Des notifications ont été envoyées sans avoir été testées`,
    ).to.deep.equal([]);
  }
}
