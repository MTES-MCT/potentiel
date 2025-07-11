import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat } from '@potentiel-domain/projet';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { SendEmail } from '../../../sendEmail';
import { getLauréat } from '../../../helpers';
import { getBaseUrl } from '../../../helpers';

import { délaiDemandéNotification } from './délaiDemandé.notification';

export type SubscriptionEvent = Lauréat.Délai.DélaiEvent & Event;

export type Execute = Message<'System.Notification.Lauréat.Délai', SubscriptionEvent>;

export type RegisterDélaiNotificationDependencies = {
  sendEmail: SendEmail;
};

export const registerDélaiNotifications = ({
  sendEmail,
}: RegisterDélaiNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      event.payload.identifiantProjet,
    );
    const projet = await getLauréat(identifiantProjet.formatter());

    const baseUrl = getBaseUrl();

    return match(event)
      .with({ type: 'DélaiDemandé-V1' }, async (event) =>
        délaiDemandéNotification({
          sendEmail,
          event,
          projet,
          baseUrl,
        }),
      )
      .with({ type: 'DélaiAccordé-V1' }, () => undefined)
      .exhaustive();
  };

  mediator.register('System.Notification.Lauréat.Délai', handler);
};
