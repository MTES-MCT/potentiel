import { match } from 'ts-pattern';

import { Email } from '@potentiel-domain/common';
import { AbstractAggregate } from '@potentiel-domain/core';

import type { AjouterNotificationApplicationOptions } from './ajouter/ajouterNotificationApplication.options.js';
import type {
  NotificationApplicationAjoutéeEvent,
  NotificationApplicationEvent,
} from './notificationApplication.event.js';

type FormatterCléNotificationProps = Pick<
  NotificationApplicationAjoutéeEvent['payload'],
  'domaine' | 'identifiantProjet' | 'dateChangement'
>;

const formatterCléNotification = ({
  domaine,
  identifiantProjet,
  dateChangement,
}: FormatterCléNotificationProps) => `${identifiantProjet}#${domaine}#${dateChangement}`;

export class NotificationApplicationAggregate extends AbstractAggregate<
  NotificationApplicationEvent,
  'notification-application'
> {
  #notifications = new Set<string>();

  get identifiantUtilisateur() {
    return Email.convertirEnValueType(this.aggregateId.split('|')[1]);
  }

  async ajouter({ domaine, identifiantProjet, dateChangement }: AjouterNotificationApplicationOptions) {
    const payload: NotificationApplicationAjoutéeEvent['payload'] = {
      domaine,
      identifiantProjet: identifiantProjet.formatter(),
      dateChangement: dateChangement.formatter(),
      identifiantUtilisateur: this.identifiantUtilisateur.formatter(),
    };

    if (this.#notifications.has(formatterCléNotification(payload))) {
      return;
    }

    await this.publish({
      type: 'NotificationApplicationAjoutée-V1',
      payload,
    });
  }

  apply(event: NotificationApplicationEvent) {
    match(event)
      .with(
        { type: 'NotificationApplicationAjoutée-V1' },
        this.applyNotificationApplicationAjoutée.bind(this),
      )
      .exhaustive();
  }

  private applyNotificationApplicationAjoutée({ payload }: NotificationApplicationAjoutéeEvent) {
    this.#notifications.add(formatterCléNotification(payload));
  }
}
