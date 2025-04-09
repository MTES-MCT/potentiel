import { Message, MessageHandler, mediator } from 'mediateur';
import { match, P } from 'ts-pattern';

import { Option } from '@potentiel-libraries/monads';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { CandidatureAdapter } from '@potentiel-infrastructure/domain-adapters';
import { Puissance } from '@potentiel-domain/laureat';
import { getLogger } from '@potentiel-libraries/monitoring';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { SendEmail } from '../../../sendEmail';

import { puissanceModifiéeNotification } from './puissanceModifiée.notification';
import { changementPuissanceAccordéNotification } from './changement/changementPuissanceAccordé.notification';
import { changementPuissanceAnnuléNotification } from './changement/changementPuissanceAnnulé.notification';
import { changementPuissanceRejetéNotification } from './changement/changementPuissanceRejeté.notification';
import { changementPuissanceDemandéNotification } from './changement/changementPuissanceDemandé.notification';
import { changementPuissanceEnregistréNotification } from './changement/changementPuissanceEnregistré.notification';

export type SubscriptionEvent = Puissance.PuissanceEvent & Event;

export type Execute = Message<'System.Notification.Lauréat.Puissance', SubscriptionEvent>;

export type RegisterPuissanceNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({ sendEmail }: RegisterPuissanceNotificationDependencies) => {
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
        fonction: 'puissance',
      });
      return;
    }
    const { BASE_URL: baseUrl } = process.env;

    if (!baseUrl) {
      getLogger().error(`variable d'environnement BASE_URL non trouvée`, {
        application: 'notifications',
        fonction: 'puissance',
      });
      return;
    }

    const projet = {
      nom: candidature.nom,
      département: candidature.localité.département,
    };

    return match(event)
      .with({ type: 'PuissanceModifiée-V1' }, async (event) =>
        puissanceModifiéeNotification({
          sendEmail,
          event,
          projet,
          baseUrl,
        }),
      )
      .with({ type: 'ChangementPuissanceEnregistré-V1' }, async (event) =>
        changementPuissanceEnregistréNotification({
          sendEmail,
          event,
          projet,
          baseUrl,
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
          baseUrl,
        }),
      )
      .with({ type: 'ChangementPuissanceAccordé-V1' }, async (event) =>
        changementPuissanceAccordéNotification({
          sendEmail,
          event,
          projet,
          baseUrl,
        }),
      )
      .with({ type: 'ChangementPuissanceRejeté-V1' }, async (event) =>
        changementPuissanceRejetéNotification({
          sendEmail,
          event,
          projet,
          baseUrl,
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
