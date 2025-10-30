import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Routes } from '@potentiel-applications/routes';
import { Candidature } from '@potentiel-domain/projet';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';

import { getBaseUrl } from '../../_helpers';
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
    const {
      payload: { identifiantProjet },
    } = event;

    match(event).with({ type: 'CandidatureCorrigée-V2' }, handleCandidatureCorrigée).exhaustive();

    switch (event.type) {
      case 'CandidatureCorrigée-V2':
        if (event.payload.doitRégénérerAttestation) {
          await sendEmail({
            templateId: templateId.attestationRegénéréePorteur,
            messageSubject: `Potentiel - Une nouvelle attestation est disponible pour le projet ${event.payload.nomProjet}`,
            recipients: [
              {
                email: event.payload.emailContact,
                fullName: event.payload.nomReprésentantLégal,
              },
            ],
            variables: {
              nom_projet: event.payload.nomProjet,
              raison: 'Votre candidature a été modifiée',
              redirect_url: `${getBaseUrl()}${Routes.Projet.details(identifiantProjet)}`,
            },
          });
        }
    }
  };
  mediator.register('System.Notification.Candidature', handler);
};
