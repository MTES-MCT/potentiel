import { Message, MessageHandler, mediator } from 'mediateur';

import { Routes } from '@potentiel-applications/routes';
import { Candidature } from '@potentiel-domain/projet';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

import { getBaseUrl } from '../../helpers';
import { SendEmail } from '../../sendEmail';

export type SubscriptionEvent = Candidature.CandidatureCorrigéeEvent & Event;

export type Execute = Message<'System.Notification.Candidature', SubscriptionEvent>;

const templateId = {
  attestationRegénéréePorteur: 1765851,
};

export type RegisterCandidatureNotificationDependencies = {
  sendEmail: SendEmail;
};

export const register = ({ sendEmail }: RegisterCandidatureNotificationDependencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    const logger = getLogger();

    const {
      payload: { identifiantProjet },
    } = event;

    switch (event.type) {
      case 'CandidatureCorrigée-V2':
        const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
          type: 'Candidature.Query.ConsulterCandidature',
          data: {
            identifiantProjet,
          },
        });

        if (Option.isNone(candidature)) {
          logger.warn(`Candidature non trouvée`, { identifiantProjet });
          return;
        }

        if (event.payload.doitRégénérerAttestation) {
          await sendEmail({
            templateId: templateId.attestationRegénéréePorteur,
            messageSubject: `Potentiel - Une nouvelle attestation est disponible pour le projet ${candidature.nomProjet}`,
            recipients: [
              {
                email: candidature.emailContact.formatter(),
                fullName: candidature.nomReprésentantLégal,
              },
            ],
            variables: {
              nom_projet: candidature.nomProjet,
              raison: 'Votre candidature a été modifiée',
              redirect_url: `${getBaseUrl()}${Routes.Projet.details(identifiantProjet)}`,
            },
          });
        }
    }
  };
  mediator.register('System.Notification.Candidature', handler);
};
