import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat } from '@potentiel-domain/projet';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { SendEmail } from '../../../sendEmail';
import { getLauréat } from '../../../helpers';
import { getBaseUrl } from '../../../helpers';

import { demandeDélaiRejetéeNotification } from './demandeDélaiRejetée.notification';
import { délaiDemandéNotification } from './délaiDemandé.notification';
import { demandeDélaiAnnuléeNotification } from './demandeDélaiAnnulée.notification';
import { demandeDélaiAccordéeNotification } from './démandeDélaiAccordée.notification';
import { demandeDélaiCorrigéeNotification } from './demandeDélaiCorrigée.notification';

export type SubscriptionEvent = Lauréat.Délai.DélaiEvent & Event;

export type Execute = Message<'System.Notification.Lauréat.Délai', SubscriptionEvent>;

export type RegisterDélaiNotificationDependencies = { sendEmail: SendEmail };

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
        délaiDemandéNotification({ sendEmail, event, projet, baseUrl }),
      )
      .with({ type: 'DemandeDélaiAnnulée-V1' }, async (event) =>
        demandeDélaiAnnuléeNotification({ sendEmail, event, projet }),
      )
      .with({ type: 'DemandeDélaiRejetée-V1' }, async (event) =>
        demandeDélaiRejetéeNotification({ sendEmail, event, projet }),
      )
      .with({ type: 'DélaiAccordé-V1' }, async (event) =>
        demandeDélaiAccordéeNotification({ sendEmail, event, projet }),
      )
      .with({ type: 'DemandeDélaiCorrigée-V1' }, async (event) =>
        demandeDélaiCorrigéeNotification({ sendEmail, event, projet, baseUrl }),
      )
      .with({ type: 'DemandeDélaiSupprimée-V1' }, () => Promise.resolve())
      .with({ type: 'DemandeDélaiPasséeEnInstruction-V1' }, () => Promise.resolve())
      .exhaustive();
  };

  mediator.register('System.Notification.Lauréat.Délai', handler);
};
