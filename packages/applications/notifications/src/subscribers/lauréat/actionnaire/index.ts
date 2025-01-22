import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { CandidatureAdapter } from '@potentiel-infrastructure/domain-adapters';
import { Actionnaire } from '@potentiel-domain/laureat';
import { getLogger } from '@potentiel-libraries/monitoring';

import { SendEmail } from '../../../sendEmail';

import { handleActionnaireModifié } from './handleActionnaireModifié.notifications';
import { handleChangementActionnaireAccordé } from './handleChangementActionnaireAccordé.notifications';
import { handleChangementActionnaireAnnulé } from './handleChangementActionnaireAnnulé.notifications';
import { handleChangementActionnaireDemandé } from './handleChangementActionnaireDemandé.notifications';
import { handleChangementActionnaireRejeté } from './handleChangementActionnaireRejeté.notifications';

export type SubscriptionEvent = Actionnaire.ActionnaireEvent & Event;

export type Execute = Message<'System.Notification.Lauréat.Actionnaire', SubscriptionEvent>;

export type RegisterActionnaireNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({ sendEmail }: RegisterActionnaireNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      event.payload.identifiantProjet,
    );
    const détailsProjet = await CandidatureAdapter.récupérerProjetAdapter(
      identifiantProjet.formatter(),
    );

    if (Option.isNone(détailsProjet)) {
      getLogger().error(new Error('Projet non trouvé'), {
        identifiantProjet: identifiantProjet.formatter(),
        application: 'notifications',
        fonction: 'actionnaire',
      });
      return;
    }

    const { BASE_URL: baseUrl } = process.env;

    if (!baseUrl) {
      getLogger().error(`variable d'environnement BASE_URL non trouvée`, {
        application: 'notifications',
        fonction: 'actionnaire',
      });
      return;
    }

    const projet = {
      nom: détailsProjet.nom,
      département: détailsProjet.localité.département,
    };

    return match(event)
      .with({ type: 'ActionnaireModifié-V1' }, async (event) =>
        handleActionnaireModifié({
          sendEmail,
          event,
          projet,
          baseUrl,
        }),
      )
      .with({ type: 'ChangementActionnaireDemandé-V1' }, async (event) =>
        handleChangementActionnaireDemandé({
          sendEmail,
          event,
          projet,
          baseUrl,
        }),
      )
      .with({ type: 'ChangementActionnaireAccordé-V1' }, async (event) =>
        handleChangementActionnaireAccordé({ sendEmail, event, projet, baseUrl }),
      )
      .with({ type: 'ChangementActionnaireRejeté-V1' }, async (event) =>
        handleChangementActionnaireRejeté({ sendEmail, event, projet, baseUrl }),
      )
      .with({ type: 'ChangementActionnaireAnnulé-V1' }, async (event) =>
        handleChangementActionnaireAnnulé({ sendEmail, event, projet, baseUrl }),
      )
      .otherwise(() => Promise.resolve());
  };

  mediator.register('System.Notification.Lauréat.Actionnaire', handler);
};
