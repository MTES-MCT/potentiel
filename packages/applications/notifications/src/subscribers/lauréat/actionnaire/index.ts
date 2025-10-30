import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';

import { getBaseUrl, getLauréat } from '../../../_helpers';
import { SendEmail } from '../../../sendEmail';

import { actionnaireModifiéNotifications } from './actionnaireModifié.notifications';
import { changementActionnaireAccordéNotifications } from './changementActionnaireAccordé.notifications';
import { changementActionnaireAnnuléNotifications } from './changementActionnaireAnnulé.notifications';
import { changementActionnaireDemandéNotifications } from './changementActionnaireDemandé.notifications';
import { changementActionnaireEnregistréNotifications } from './changementActionnaireEnregistré.notifications';
import { changementActionnaireRejetéNotifications } from './changementActionnaireRejeté.notifications';

export type SubscriptionEvent = Lauréat.Actionnaire.ActionnaireEvent & Event;

export type Execute = Message<'System.Notification.Lauréat.Actionnaire', SubscriptionEvent>;

export type RegisterActionnaireNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({ sendEmail }: RegisterActionnaireNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      event.payload.identifiantProjet,
    );
    const projet = await getLauréat(identifiantProjet.formatter());

    const baseUrl = getBaseUrl();

    return match(event)
      .with({ type: 'ActionnaireModifié-V1' }, async (event) =>
        actionnaireModifiéNotifications({
          sendEmail,
          event,
          projet,
        }),
      )
      .with({ type: 'ChangementActionnaireDemandé-V1' }, async (event) =>
        changementActionnaireDemandéNotifications({
          sendEmail,
          event,
          projet,
          baseUrl,
        }),
      )
      .with({ type: 'ChangementActionnaireAccordé-V1' }, async (event) =>
        changementActionnaireAccordéNotifications({ sendEmail, event, projet }),
      )
      .with({ type: 'ChangementActionnaireRejeté-V1' }, async (event) =>
        changementActionnaireRejetéNotifications({ sendEmail, event, projet }),
      )
      .with({ type: 'ChangementActionnaireAnnulé-V1' }, async (event) =>
        changementActionnaireAnnuléNotifications({ sendEmail, event, projet }),
      )
      .with({ type: 'ChangementActionnaireEnregistré-V1' }, async (event) =>
        changementActionnaireEnregistréNotifications({ sendEmail, event, projet }),
      )
      .otherwise(() => Promise.resolve());
  };

  mediator.register('System.Notification.Lauréat.Actionnaire', handler);
};
