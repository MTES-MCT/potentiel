import { assert, expect } from 'chai';

import { Email } from '@potentiel-domain/common';
import { getLogger } from '@potentiel-libraries/monitoring';

type EmailItem = {
  recipients: Array<{ email: string }>;
  subject: string;
  values: Record<string, string>;
};

export class NotificationWorld {
  #notifications: {
    subject: string;
    values: Record<string, string>;
    email: Email.ValueType;
    checked?: true;
  }[] = [];

  ajouterNotification(notif: EmailItem) {
    for (const recipient of notif.recipients) {
      this.#notifications.push({
        ...notif,
        email: Email.convertirEnValueType(recipient.email),
      });
    }
  }

  vérifierNotification(emailValue: string, sujet?: string, variables?: Record<string, string>) {
    const logger = getLogger('NotificationWorld');
    const email = Email.convertirEnValueType(emailValue);

    const erreurs: string[] = [];

    const notif = this.#notifications.find((notif) => {
      if (notif.checked) {
        return false;
      }

      if (!notif.email.estÉgaleÀ(email)) {
        return false;
      }

      if (sujet && !(notif.subject.match(new RegExp(sujet)) || sujet === notif.subject)) {
        erreurs.push(
          `Le sujet attendu par le test ("${sujet}") ne correspond pas au sujet reçu ("${notif.subject}")`,
        );
        return false;
      }

      if (variables) {
        if (Object.keys(notif.values).length === 0) {
          erreurs.push(
            `Le test attend des variables (${Object.keys(variables).join(', ')}) mais la valeur reçue n'en contient aucune`,
          );
          return false;
        }

        for (const [key, value] of Object.entries(variables)) {
          if (!new RegExp(value).test(notif.values[key])) {
            if (notif.values[key] === undefined) {
              erreurs.push(`${key} -> La variable est manquante`);

              return false;
            }

            erreurs.push(`${key} -> Expected : ${value} | Actual : ${notif.values[key]}`);

            return false;
          }
        }
      }
      return true;
    });

    if (!notif) {
      logger.error(`Aucune notification trouvée`, {
        sujet,
        emailValue,
        erreurs,
        notificationsEnvoyées: this.#notifications.map((x) => ({
          sujet: x.subject,
          recipients: x.email,
          values: x.values,
        })),
      });
    }
    assert(
      notif,
      `Pas de notification correspondante : 
        ${sujet ? `- Sujet: "${sujet}")` : ''}
        ${
          erreurs.length
            ? `- Raisons de rejet :
              - ${erreurs.join('\n- ')}`
            : ''
        }`,
    );

    notif.checked = true;
  }

  resetNotifications() {
    this.#notifications = [];
  }

  vérifierAucunEmailEnvoyé(emailValue: string) {
    const email = Email.convertirEnValueType(emailValue);
    const notif = this.#notifications.find((notif) => notif.email.estÉgaleÀ(email));
    expect(notif, `Des emails ont été envoyés`).to.be.undefined;
  }

  vérifierToutesNotificationsPointées() {
    expect(
      this.#notifications
        .filter((notif) => !notif.checked)
        .map((notif) => ({ email: notif.email, subject: notif.subject })),
      `Des notifications ont été envoyées sans avoir été testées`,
    ).to.deep.equal([]);
  }
}
