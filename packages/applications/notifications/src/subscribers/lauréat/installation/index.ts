import { mediator, Message, MessageHandler } from 'mediateur';
import { match, P } from 'ts-pattern';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';

import { getLauréat } from '../../../_helpers';
import { SendEmail } from '../../../sendEmail';

import { DispositifDeStockageModifiéNotifications } from './dispositifDeStockageModifiée.notifications';
import { installateurModifiéNotification } from './installateurModifié.notification';
import { typologieInstallationModifiéeNotification } from './typologieInstallationModifiée.notification';

export type SubscriptionEvent = Lauréat.Installation.InstallationEvent & Event;

export type Execute = Message<'System.Notification.Lauréat.Installation', SubscriptionEvent>;

export type RegisterInstallationNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({ sendEmail }: RegisterInstallationNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      event.payload.identifiantProjet,
    );

    const projet = await getLauréat(identifiantProjet.formatter());

    return match(event)
      .with({ type: 'InstallateurModifié-V1' }, async (event) =>
        installateurModifiéNotification({
          sendEmail,
          event,
          projet,
        }),
      )
      .with({ type: 'TypologieInstallationModifiée-V1' }, async (event) =>
        typologieInstallationModifiéeNotification({
          sendEmail,
          event,
          projet,
        }),
      )
      .with({ type: 'DispositifDeStockageModifié-V1' }, async (event) =>
        DispositifDeStockageModifiéNotifications({
          sendEmail,
          event,
          projet,
        }),
      )
      .with(
        {
          type: P.union('InstallationImportée-V1'),
        },
        () => Promise.resolve(),
      )
      .exhaustive();
  };

  mediator.register('System.Notification.Lauréat.Installation', handler);
};
