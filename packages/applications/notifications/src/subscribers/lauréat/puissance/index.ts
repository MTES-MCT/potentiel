import { Message, MessageHandler, mediator } from 'mediateur';
import { match, P } from 'ts-pattern';

import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat } from '@potentiel-domain/projet';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { SendEmail } from '../../../sendEmail';
import { getLauréat } from '../../../_helpers';
import { getBaseUrl } from '../../../_helpers';

import { puissanceModifiéeNotification } from './puissanceModifiée.notification';
import { changementPuissanceAccordéNotification } from './changement/changementPuissanceAccordé.notification';
import { changementPuissanceAnnuléNotification } from './changement/changementPuissanceAnnulé.notification';
import { changementPuissanceRejetéNotification } from './changement/changementPuissanceRejeté.notification';
import { changementPuissanceDemandéNotification } from './changement/changementPuissanceDemandé.notification';
import { changementPuissanceEnregistréNotification } from './changement/changementPuissanceEnregistré.notification';

export type SubscriptionEvent = Lauréat.Puissance.PuissanceEvent & Event;

export type Execute = Message<'System.Notification.Lauréat.Puissance', SubscriptionEvent>;

export type RegisterPuissanceNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({ sendEmail }: RegisterPuissanceNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      event.payload.identifiantProjet,
    );
    const projet = await getLauréat(identifiantProjet.formatter());

    const baseUrl = getBaseUrl();

    return match(event)
      .with({ type: 'PuissanceModifiée-V1' }, async (event) =>
        puissanceModifiéeNotification({
          sendEmail,
          event,
          projet,
        }),
      )
      .with({ type: 'ChangementPuissanceEnregistré-V1' }, async (event) =>
        changementPuissanceEnregistréNotification({
          sendEmail,
          event,
          projet,
        }),
      )
      .with({ type: 'ChangementPuissanceDemandé-V1' }, async (event) =>
        changementPuissanceDemandéNotification({
          sendEmail,
          event,
          projet,
          baseUrl,
        }),
      )
      .with({ type: 'ChangementPuissanceAnnulé-V1' }, async (event) =>
        changementPuissanceAnnuléNotification({
          sendEmail,
          event,
          projet,
        }),
      )
      .with({ type: 'ChangementPuissanceAccordé-V1' }, async (event) =>
        changementPuissanceAccordéNotification({
          sendEmail,
          event,
          projet,
        }),
      )
      .with({ type: 'ChangementPuissanceRejeté-V1' }, async (event) =>
        changementPuissanceRejetéNotification({
          sendEmail,
          event,
          projet,
        }),
      )
      .with(
        {
          type: P.union('ChangementPuissanceSupprimé-V1', 'PuissanceImportée-V1'),
        },
        () => Promise.resolve(),
      )
      .exhaustive();
  };

  mediator.register('System.Notification.Lauréat.Puissance', handler);
};
