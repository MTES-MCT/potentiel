import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Accès } from '@potentiel-domain/projet';

import { SendEmail } from '../../sendEmail';
import { getCandidature } from '../../_helpers';

import { handleAccèsProjetRetiré, handleAccèsProjetAutoriséSuiteÀRéclamation } from './handlers';

export type SubscriptionEvent = Accès.AccèsEvent & Event;

export type Execute = Message<'System.Notification.Accès', SubscriptionEvent>;

export type RegisterUtilisateurNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({ sendEmail }: RegisterUtilisateurNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    const candidature = await getCandidature(event.payload.identifiantProjet);

    await match(event)
      .with({ type: 'AccèsProjetRetiré-V1' }, (event) =>
        handleAccèsProjetRetiré({
          sendEmail,
          event,
          candidature,
        }),
      )
      .with(
        {
          type: 'AccèsProjetAutorisé-V1',
          payload: {
            raison: 'réclamation',
          },
        },
        (event) => handleAccèsProjetAutoriséSuiteÀRéclamation({ sendEmail, event, candidature }),
      )
      .otherwise(() => Promise.resolve());
  };

  mediator.register('System.Notification.Accès', handler);
};
