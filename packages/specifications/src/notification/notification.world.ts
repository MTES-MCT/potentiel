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

  vérifierNotification(emailValue: string, sujet?: string, variables?: Record<string, string>) {
    const logger = getLogger('NotificationWorld');
    const email = Email.convertirEnValueType(emailValue);
    const notif = this.#notifications.find((notif) => {
      if (notif.checked) {
        return false;
      }
      if (sujet && !notif.messageSubject.match(new RegExp(sujet))) {
        return false;
      }
      if (variables) {
        for (const [key, value] of Object.entries(variables)) {
          if (!new RegExp(value).test(notif.variables[key])) {
            logger.warn(
              "Une notification correspond au sujet et à l'email, mais pas aux variables",
              {
                key,
                expected: value,
                actual: notif.variables[key],
                email: email.formatter(),
                sujet,
              },
            );

            return false;
          }
        }
      }
      return notif.email.estÉgaleÀ(email);
    });

    if (!notif) {
      logger.error(`Aucune notification trouvée`, {
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
