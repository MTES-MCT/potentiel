import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { CandidatureAdapter } from '@potentiel-infrastructure/domain-adapters';
import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { getLogger } from '@potentiel-libraries/monitoring';

import { SendEmail } from '../../../sendEmail';

import { représentantLégalModifiéNotification } from './représentantLégalModifié.notification';
import { changementReprésentantLégalDemandéNotification } from './changementReprésentantLégalDemandé.notification';
import { changementReprésentantLégalAccordéNotification } from './changementReprésentantLégalAccordé.notification';
import { changementReprésentantLégalRejetéNotification } from './changementReprésentantLégalRejeté.notification';
import { changementReprésentantLégalAnnuléNotification } from './changementReprésentantLégalAnnulé.notification';
import { changementReprésentantLégalCorrigéNotification } from './changementReprésentantLégalCorrigé.notification';

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
        représentantLégalModifiéNotification({
          sendEmail,
          event,
          projet,
          baseUrl,
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
      .with({ type: 'ChangementReprésentantLégalAnnulé-V1' }, async (event) =>
        changementReprésentantLégalAnnuléNotification({
          sendEmail,
          event,
          projet,
          baseUrl,
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
        changementReprésentantLégalAccordéNotification({ sendEmail, event, projet, baseUrl }),
      )
      .with({ type: 'ChangementReprésentantLégalRejeté-V1' }, async (event) =>
        changementReprésentantLégalRejetéNotification({ sendEmail, event, projet, baseUrl }),
      )
      .otherwise(() => Promise.resolve());
  };

  mediator.register('System.Notification.Lauréat.ReprésentantLégal', handler);
};
