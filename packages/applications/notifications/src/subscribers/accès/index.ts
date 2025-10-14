import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Accès, IdentifiantProjet } from '@potentiel-domain/projet';

import { SendEmail } from '../../sendEmail';
import { getLauréat } from '../../helpers';
import { getÉliminé } from '../../helpers/getÉliminé';
import { ProjetNonTrouvéError } from '../../helpers/ProjetNonTrouvé.error';

import { accèsProjetRetiréNotification } from './accèsProjetRetiré.notification';
import { accèsProjetAutoriséNotification } from './accèsProjetAutorisé.notification';

export type SubscriptionEvent = Accès.AccèsEvent & Event;

export type Execute = Message<'System.Notification.Accès', SubscriptionEvent>;

export type RegisterUtilisateurNotificationDependencies = {
  sendEmail: SendEmail;
};

const getProjet = async (identifiantProjet: IdentifiantProjet.RawType) => {
  try {
    return getLauréat(identifiantProjet);
  } catch (error) {
    try {
      return getÉliminé(identifiantProjet);
    } catch (error) {
      throw new ProjetNonTrouvéError();
    }
  }
};

export const register = ({ sendEmail }: RegisterUtilisateurNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    const projet = await getProjet(event.payload.identifiantProjet);

    return match(event)
      .with(
        {
          type: 'AccèsProjetAutorisé-V1',
          payload: {
            raison: 'réclamation',
          },
        },
        (event) => accèsProjetAutoriséNotification({ sendEmail, event, projet }),
      )
      .with({ type: 'AccèsProjetRetiré-V1' }, (event) =>
        accèsProjetRetiréNotification({ sendEmail, event, projet }),
      )
      .otherwise(() => Promise.resolve());
  };

  mediator.register('System.Notification.Accès', handler);
};
