import { Message, MessageHandler, mediator } from 'mediateur';
import { sendEmail } from '@potentiel/email-sender';
import { convertirEnIdentifiantProjet } from '@potentiel/domain-usecases';
import { isSome } from '@potentiel/monads';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import {
  RécupérerCandidatureLegacyPort,
  RécupérerPorteursProjetPort,
} from '@potentiel/domain-views';
import { Abandon } from '@potentiel-domain/laureat';

export type ExecuteLauréatAbandonNotification = Message<
  'EXECUTE_LAUREAT_ABANDON_NOTIFICATION',
  Abandon.AbandonEvent & Event
>;

export type AbandonNotificationDependencies = {
  récupérerCandidatureLegacy: RécupérerCandidatureLegacyPort;
  récupérerPorteursProjet: RécupérerPorteursProjetPort;
};

export const registerLauréatAbandonNotification = ({
  récupérerCandidatureLegacy,
  récupérerPorteursProjet,
}: AbandonNotificationDependencies) => {
  const handler: MessageHandler<ExecuteLauréatAbandonNotification> = async (event) => {
    switch (event.type) {
      case 'AbandonAccordé-V1':
        const projet = await récupérerCandidatureLegacy(
          convertirEnIdentifiantProjet(event.payload.identifiantProjet),
        );

        if (isSome(projet)) {
          const urlTransmettrePreuveRecandidature = `/projet/${encodeURIComponent(
            projet.legacyId,
          )}/transmettre-preuve-recandidature`;
          const porteurs = await récupérerPorteursProjet(
            convertirEnIdentifiantProjet(event.payload.identifiantProjet),
          );

          sendEmail({
            templateId: '5308275',
            messageSubject: `Transmettre une preuve de recandidature suite à l'abandon du projet ${projet.nom}`,
            recipients: porteurs,
            variables: {
              lien_transmettre_preuve_recandidature: urlTransmettrePreuveRecandidature,
            },
          });
        }
        break;
    }
  };

  mediator.register('EXECUTE_LAUREAT_ABANDON_NOTIFICATION', handler);
};
