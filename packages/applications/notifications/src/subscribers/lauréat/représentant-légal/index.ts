import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { CandidatureAdapter } from '@potentiel-infrastructure/domain-adapters';
import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { getLogger } from '@potentiel-libraries/monitoring';

import { SendEmail } from '../../../sendEmail';

import { handleReprésentantLégalModifié } from './handleReprésentantLégalModifié';
import { handleChangementReprésentantLégalDemandé } from './handleChangementReprésentantLégalDemandé';

export type SubscriptionEvent = ReprésentantLégal.ReprésentantLégalEvent & Event;

export type Execute = Message<'System.Notification.Lauréat.ReprésentantLégal', SubscriptionEvent>;

export type RegisterReprésentantLégalNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({ sendEmail }: RegisterReprésentantLégalNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      event.payload.identifiantProjet,
    );
    const candidature = await CandidatureAdapter.récupérerProjetAdapter(
      identifiantProjet.formatter(),
    );

    if (Option.isNone(candidature)) {
      getLogger().error(new Error('Projet non trouvé'), {
        identifiantProjet: identifiantProjet.formatter(),
        application: 'notifications',
        fonction: 'représentant-légal',
      });
      return;
    }
    const { BASE_URL: baseUrl } = process.env;

    if (!baseUrl) {
      getLogger().error(`variable d'environnement BASE_URL non trouvée`, {
        application: 'notifications',
        fonction: 'représentant-légal',
      });
      return;
    }

    const projet = {
      nom: candidature.nom,
      département: candidature.localité.département,
    };

    return match(event)
      .with({ type: 'ReprésentantLégalModifié-V1' }, async (event) =>
        handleReprésentantLégalModifié({
          sendEmail,
          event,
          projet,
          baseUrl,
        }),
      )
      .with({ type: 'ChangementReprésentantLégalDemandé-V1' }, async (event) =>
        handleChangementReprésentantLégalDemandé({
          sendEmail,
          event,
          projet,
          baseUrl,
        }),
      )
      .otherwise(() => Promise.resolve());
    /*  
    .with({ type: 'ChangementReprésentantLégalAccordé-V1' }, async (event) =>
      handleReprésentantLégalAccordé({ sendEmail, event, projet, baseUrl }),
    )
    .with({ type: 'ChangementReprésentantLégalRejeté-V1' }, async (event) =>
      handleReprésentantLégalRejeté({ sendEmail, event, projet, baseUrl }),
    )
    */
  };

  mediator.register('System.Notification.Lauréat.ReprésentantLégal', handler);
};
