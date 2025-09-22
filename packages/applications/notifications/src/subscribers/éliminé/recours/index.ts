import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet, Éliminé } from '@potentiel-domain/projet';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';

import { getBaseUrl, getCandidature } from '../../../helpers';
import { SendEmail } from '../../../sendEmail';

import { recoursAccordéNotification } from './recoursAccordé.notifications';
import { recoursRejetéNotification } from './recoursRejeté.notifications';
import { recoursDemandéNotification } from './recoursDemandé.notifications';
import { recoursAnnuléNotification } from './recoursAnnulé.notifications';

export type SubscriptionEvent = (
  | Éliminé.Recours.RecoursDemandéEvent
  | Éliminé.Recours.RecoursRejetéEvent
  | Éliminé.Recours.RecoursAnnuléEvent
  | Éliminé.Recours.RecoursAccordéEvent
) &
  Event;

export type Execute = Message<'System.Notification.Eliminé.Recours', SubscriptionEvent>;

export type RegisterRecoursNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({ sendEmail }: RegisterRecoursNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      event.payload.identifiantProjet,
    );

    const candidature = await getCandidature(identifiantProjet.formatter());
    const projet = {
      ...candidature,
      url: getBaseUrl() + Routes.Projet.details(identifiantProjet.formatter()),
    };

    await match(event)
      .with({ type: 'RecoursDemandé-V1' }, (event) =>
        recoursDemandéNotification({ sendEmail, event, projet }),
      )
      .with({ type: 'RecoursAnnulé-V1' }, (event) =>
        recoursAnnuléNotification({ sendEmail, event, projet }),
      )
      .with({ type: 'RecoursAccordé-V1' }, (event) =>
        recoursAccordéNotification({ sendEmail, event, projet }),
      )
      .with({ type: 'RecoursRejeté-V1' }, (event) =>
        recoursRejetéNotification({ sendEmail, event, projet }),
      )
      .exhaustive();
  };

  mediator.register('System.Notification.Eliminé.Recours', handler);
};
