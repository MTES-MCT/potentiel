import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';
import type { LoadAggregate } from '@potentiel-domain/core';
import type { IdentifiantProjet } from '@potentiel-domain/projet';

import { NotificationApplicationAggregate } from '../notificationApplication.aggregate.js';
import type { NotificationApplicationAjoutéeEvent } from '../notificationApplication.event.js';

export type AjouterNotificationApplicationCommand = Message<
  'NotificationApplication.Command.Ajouter',
  {
    identifiantUtilisateur: Email.ValueType;
    domaine: NotificationApplicationAjoutéeEvent['payload']['domaine'];
    identifiantProjet: IdentifiantProjet.ValueType;
    dateChangement: DateTime.ValueType;
  }
>;

export const registerAjouterNotificationApplicationCommand = (loadAggregate: LoadAggregate) => {
  const handler: MessageHandler<AjouterNotificationApplicationCommand> = async ({
    identifiantUtilisateur,
    domaine,
    identifiantProjet,
    dateChangement,
  }) => {
    const notificationApplication = await loadAggregate(
      NotificationApplicationAggregate,
      `notification-application|${identifiantUtilisateur.formatter()}`,
      undefined,
    );

    await notificationApplication.ajouter({
      domaine,
      identifiantProjet,
      dateChangement,
    });
  };

  mediator.register('NotificationApplication.Command.Ajouter', handler);
};
