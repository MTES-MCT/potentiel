import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';

import { getLauréat } from '../../../helpers';
import { SendEmail } from '../../../sendEmail';

import { DispositifDeStockageModifiéNotifications } from './dispositifDeStockageModifiée.notifications';

export type SubscriptionEvent = Lauréat.DispositifDeStockage.DispositifDeStockageEvent & Event;

export type Execute = Message<
  'System.Notification.Lauréat.DispositifDeStockage',
  SubscriptionEvent
>;

export type RegisterDispositifDeStockageNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({ sendEmail }: RegisterDispositifDeStockageNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      event.payload.identifiantProjet,
    );
    const projet = await getLauréat(identifiantProjet.formatter());

    return match(event)
      .with({ type: 'DispositifDeStockageModifié-V1' }, async (event) =>
        DispositifDeStockageModifiéNotifications({
          sendEmail,
          event,
          projet,
        }),
      )
      .with(
        {
          type: 'DispositifDeStockageImporté-V1',
        },
        () => Promise.resolve(),
      )
      .exhaustive();
  };

  mediator.register('System.Notification.Lauréat.DispositifDeStockage', handler);
};
