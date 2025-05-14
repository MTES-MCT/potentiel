import { Message, MessageHandler, mediator } from 'mediateur';
import { match, P } from 'ts-pattern';

import { Option } from '@potentiel-libraries/monads';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { CandidatureAdapter } from '@potentiel-infrastructure/domain-adapters';
import { getLogger } from '@potentiel-libraries/monitoring';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { SendEmail } from '../../../sendEmail';

import { changementProducteurEnregistréNotification } from './changementProducteurEnregistré.notification';
import { producteurModifiéNotification } from './producteurModifié.notification';

export type SubscriptionEvent = Lauréat.Producteur.ProducteurEvent & Event;

export type Execute = Message<'System.Notification.Lauréat.Producteur', SubscriptionEvent>;

export type RegisterProducteurNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({ sendEmail }: RegisterProducteurNotificationDependencies) => {
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
        fonction: 'producteur',
        eventType: event.type,
      });
      return;
    }
    const { BASE_URL: baseUrl } = process.env;

    if (!baseUrl) {
      getLogger().error(`variable d'environnement BASE_URL non trouvée`, {
        application: 'notifications',
        fonction: 'producteur',
      });
      return;
    }

    const projet = {
      nom: candidature.nom,
      département: candidature.localité.département,
      région: candidature.localité.région,
    };

    return match(event)
      .with({ type: 'ProducteurModifié-V1' }, async (event) =>
        producteurModifiéNotification({
          sendEmail,
          event,
          projet,
          baseUrl,
        }),
      )
      .with({ type: 'ChangementProducteurEnregistré-V1' }, async (event) =>
        changementProducteurEnregistréNotification({
          sendEmail,
          event,
          projet,
          baseUrl,
        }),
      )
      .with(
        {
          type: P.union('ProducteurImporté-V1'),
        },
        () => Promise.resolve(),
      )
      .exhaustive();
  };

  mediator.register('System.Notification.Lauréat.Producteur', handler);
};
