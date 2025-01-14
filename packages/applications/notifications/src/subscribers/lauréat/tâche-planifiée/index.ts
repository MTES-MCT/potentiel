import { match, P } from 'ts-pattern';
import { Message, MessageHandler, mediator } from 'mediateur';

import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { TâchePlanifiéeExecutéeEvent } from '@potentiel-domain/tache-planifiee';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Option } from '@potentiel-libraries/monads';
import { CandidatureAdapter } from '@potentiel-infrastructure/domain-adapters';

import { SendEmail } from '../../../sendEmail';

import {} from '@potentiel-domain/laureat';
import { handleGarantiesFinancièresRappelÉchéance } from './handleGarantiesFinancièresRappelÉchéance';
import { handleReprésentantLégalRappelInstructionÀDeuxMois } from './handleReprésentantLégalRappelInstructionÀDeuxMois';

export type SubscriptionEvent = TâchePlanifiéeExecutéeEvent & Event;

export type Execute = Message<'System.Notification.TâchePlanifiée', SubscriptionEvent>;

export type RegisterTâchePlanifiéeNotificationDependencies = {
  sendEmail: SendEmail;
};

type TâchePlanifiée =
  | 'garanties-financières.rappel-échéance-un-mois'
  | 'garanties-financières.rappel-échéance-deux-mois'
  | 'représentant-légal.rappel-instruction-à-deux-mois';

export const register = ({ sendEmail }: RegisterTâchePlanifiéeNotificationDependencies) => {
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
        fonction: 'tâche-planifiée',
      });
      return;
    }
    const { BASE_URL: baseUrl } = process.env;

    if (!baseUrl) {
      getLogger().error(`variable d'environnement BASE_URL non trouvée`, {
        application: 'notifications',
        fonction: 'tâche-planifiée',
      });
      return;
    }

    const projet = {
      nom: candidature.nom,
      département: candidature.localité.département,
    };

    return match(event.payload.typeTâchePlanifiée as TâchePlanifiée)
      .with(
        P.union(
          'garanties-financières.rappel-échéance-un-mois',
          'garanties-financières.rappel-échéance-deux-mois',
        ),
        async () =>
          handleGarantiesFinancièresRappelÉchéance({
            sendEmail,
            identifiantProjet,
            event,
            projet,
            baseUrl,
          }),
      )
      .with('représentant-légal.rappel-instruction-à-deux-mois', async () =>
        handleReprésentantLégalRappelInstructionÀDeuxMois({
          sendEmail,
          identifiantProjet,
          projet,
          baseUrl,
        }),
      )
      .exhaustive();
  };

  mediator.register('System.Notification.TâchePlanifiée', handler);
};
