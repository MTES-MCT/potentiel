import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';

import { getLauréat } from '../../../helpers';
import { SendEmail } from '../../../sendEmail';

import { installationAvecDispositifDeStockageModifiéeNotifications } from './installationAvecDispositifDeStockageModifiée.notifications';

export type SubscriptionEvent =
  Lauréat.InstallationAvecDispositifDeStockage.InstallationAvecDispositifDeStockageEvent & Event;

export type Execute = Message<
  'System.Notification.Lauréat.InstallationAvecDispositifDeStockage',
  SubscriptionEvent
>;

export type RegisterInstallationAvecDispositifDeStockageNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({
  sendEmail,
}: RegisterInstallationAvecDispositifDeStockageNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      event.payload.identifiantProjet,
    );
    const projet = await getLauréat(identifiantProjet.formatter());

    return match(event)
      .with({ type: 'InstallationAvecDispositifDeStockageModifiée-V1' }, async (event) =>
        installationAvecDispositifDeStockageModifiéeNotifications({
          sendEmail,
          event,
          projet,
        }),
      )
      .with(
        {
          type: 'InstallationAvecDispositifDeStockageImportée-V1',
        },
        () => Promise.resolve(),
      )
      .exhaustive();
  };

  mediator.register('System.Notification.Lauréat.InstallationAvecDispositifDeStockage', handler);
};
