import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { CandidatureAdapter } from '@potentiel-infrastructure/domain-adapters';
import { Actionnaire } from '@potentiel-domain/laureat';
import { getLogger } from '@potentiel-libraries/monitoring';

import { SendEmail } from '../../../sendEmail';

import { handleActionnaireModifié } from './handleActionnaireModifié';
import { handleDemandeChangementActionnaireAccordée } from './handleDemandeChangementActionnaireAccordée';
import { handleDemandeChangementActionnaireAnnulée } from './handleDemandeChangementActionnaireAnnulée';
import { handleChangementActionnaireDemandé } from './handleChangementActionnaireDemandé';
import { handleDemandeChangementActionnaireRejetée } from './handleDemandeChangementActionnaireRejetée';

export type SubscriptionEvent = Actionnaire.ActionnaireEvent & Event;

export type Execute = Message<'System.Notification.Lauréat.Actionnaire', SubscriptionEvent>;

export type RegisterActionnaireNotificationDependencies = {
  sendEmail: SendEmail;
};

// voir si le cas transmis doit être géré

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
        fonction: 'représentant-légal',
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
      .with({ type: 'DemandeChangementActionnaireAccordée-V1' }, async (event) =>
        handleDemandeChangementActionnaireAccordée({ sendEmail, event, projet, baseUrl }),
      )
      .with({ type: 'DemandeChangementActionnaireRejetée-V1' }, async (event) =>
        handleDemandeChangementActionnaireRejetée({ sendEmail, event, projet, baseUrl }),
      )
      .with({ type: 'DemandeChangementActionnaireAnnulée-V1' }, async (event) =>
        handleDemandeChangementActionnaireAnnulée({ sendEmail, event, projet, baseUrl }),
      )
      .otherwise(() => Promise.resolve());
  };

  mediator.register('System.Notification.Lauréat.Actionnaire', handler);
};
