import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';
import { getBaseUrl, getLauréat } from '@helpers';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { SendEmail } from '@/sendEmail';

import { changementReprésentantLégalAccordéNotification } from './handlers/changementReprésentantLégalAccordé.notification';
import { changementReprésentantLégalAnnuléNotification } from './handlers/changementReprésentantLégalAnnulé.notification';
import { changementReprésentantLégalCorrigéNotification } from './handlers/changementReprésentantLégalCorrigé.notification';
import { changementReprésentantLégalDemandéNotification } from './handlers/changementReprésentantLégalDemandé.notification';
import { changementReprésentantLégalRejetéNotification } from './handlers/changementReprésentantLégalRejeté.notification';
import { représentantLégalModifiéNotification } from './représentantLégalModifié.notification';
import { changementReprésentantLégalEnregistréNotification } from './handlers/changementReprésentantLégalEnregistré.notification';

export type SubscriptionEvent = Lauréat.ReprésentantLégal.ReprésentantLégalEvent;

export type Execute = Message<'System.Notification.Lauréat.ReprésentantLégal', SubscriptionEvent>;

export type RegisterReprésentantLégalNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({ sendEmail }: RegisterReprésentantLégalNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      event.payload.identifiantProjet,
    );

    const projet = await getLauréat(identifiantProjet.formatter());

    const baseUrl = getBaseUrl();

    return match(event)
      .with({ type: 'ReprésentantLégalModifié-V1' }, async (event) =>
        représentantLégalModifiéNotification({
          sendEmail,
          event,
          projet,
        }),
      )
      .with({ type: 'ChangementReprésentantLégalDemandé-V1' }, async (event) =>
        changementReprésentantLégalDemandéNotification({
          sendEmail,
          event,
          projet,
          baseUrl,
        }),
      )
      .with({ type: 'ChangementReprésentantLégalEnregistré-V1' }, async (event) =>
        changementReprésentantLégalEnregistréNotification({
          sendEmail,
          event,
          projet,
        }),
      )
      .with({ type: 'ChangementReprésentantLégalAnnulé-V1' }, async (event) =>
        changementReprésentantLégalAnnuléNotification({
          sendEmail,
          event,
          projet,
        }),
      )
      .with({ type: 'ChangementReprésentantLégalCorrigé-V1' }, async (event) =>
        changementReprésentantLégalCorrigéNotification({
          sendEmail,
          event,
          projet,
          baseUrl,
        }),
      )
      .with({ type: 'ChangementReprésentantLégalAccordé-V1' }, async (event) =>
        changementReprésentantLégalAccordéNotification({ sendEmail, event, projet }),
      )
      .with({ type: 'ChangementReprésentantLégalRejeté-V1' }, async (event) =>
        changementReprésentantLégalRejetéNotification({ sendEmail, event, projet }),
      )
      .otherwise(() => Promise.resolve());
  };

  mediator.register('System.Notification.Lauréat.ReprésentantLégal', handler);
};
