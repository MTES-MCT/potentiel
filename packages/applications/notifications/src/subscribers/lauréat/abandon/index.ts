import { Message, MessageHandler, mediator } from 'mediateur';
import { match, P } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';

import { getLauréat } from '../../../helpers';
import { SendEmail } from '../../../sendEmail';

import { abandonDemandéNotifications } from './abandonDemandé.notifications';
import { abandonAccordéNotifications } from './abandonAccordé.notifications';
import { abandonAnnuléNotifications } from './abandonAnnulé.notifications';
import { abandonConfirméNotifications } from './abandonConfirmé.notifications';
import { confirmationAbandonDemandéeNotifications } from './confirmationAbandonDemandée.notifications';
import { abandonRejetéNotifications } from './abandonRejeté.notifications';
import { preuveRecandidatureDemandéeNotifications } from './preuveRecandidatureDemandée.notifications';
import { abandonPasséEnInstructionNotifications } from './abandonPasséEnInstruction.notifications';

export type SubscriptionEvent = Lauréat.Abandon.AbandonEvent & Event;

export type Execute = Message<'System.Notification.Lauréat.Abandon', SubscriptionEvent>;

export type RegisterAbandonNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({ sendEmail }: RegisterAbandonNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    const projet = await getLauréat(event.payload.identifiantProjet);

    await match(event)
      .with({ type: P.union('AbandonDemandé-V1', 'AbandonDemandé-V2') }, (event) =>
        abandonDemandéNotifications({
          sendEmail,
          event,
          projet,
        }),
      )
      .with({ type: 'AbandonAnnulé-V1' }, (event) =>
        abandonAnnuléNotifications({
          sendEmail,
          event,
          projet,
        }),
      )
      .with({ type: 'ConfirmationAbandonDemandée-V1' }, (event) =>
        confirmationAbandonDemandéeNotifications({
          sendEmail,
          event,
          projet,
        }),
      )
      .with({ type: 'AbandonConfirmé-V1' }, (event) =>
        abandonConfirméNotifications({
          sendEmail,
          event,
          projet,
        }),
      )
      .with({ type: 'AbandonAccordé-V1' }, (event) =>
        abandonAccordéNotifications({
          sendEmail,
          event,
          projet,
        }),
      )
      .with({ type: 'AbandonRejeté-V1' }, (event) =>
        abandonRejetéNotifications({ sendEmail, event, projet }),
      )
      .with({ type: 'AbandonPasséEnInstruction-V1' }, (event) =>
        abandonPasséEnInstructionNotifications({ sendEmail, event, projet }),
      )
      .with({ type: 'PreuveRecandidatureDemandée-V1' }, (event) =>
        preuveRecandidatureDemandéeNotifications({ sendEmail, event, projet }),
      )
      .otherwise(() => Promise.resolve());
  };

  mediator.register('System.Notification.Lauréat.Abandon', handler);
};
