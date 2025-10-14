import { mediator, Message, MessageHandler } from 'mediateur';
import { match, P } from 'ts-pattern';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';

import { getLauréat } from '../../../helpers';
import { SendEmail } from '../../../sendEmail';

import { installateurModifiéNotification } from './installateurModifié.notification';
import { typologieDuProjetModifiéeNotification } from './typologieDuProjetModifiée.notification';

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
      .with({ type: 'TypologieDuProjetModifiée-V1' }, async (event) =>
        typologieDuProjetModifiéeNotification({
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
