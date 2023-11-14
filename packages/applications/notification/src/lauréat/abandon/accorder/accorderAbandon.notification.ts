import { Message, MessageHandler, mediator } from 'mediateur';
import { sendEmail } from '@potentiel/email-sender';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { isSome } from '@potentiel/monads';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { RécupérerPorteursProjetPort } from '@potentiel/domain-views';
import { Abandon } from '@potentiel-domain/laureat';
import { RécupérerCandidaturePort } from '@potentiel-domain/candidature';

export type ExecuteLauréatAbandonNotification = Message<
  'EXECUTE_LAUREAT_ABANDON_NOTIFICATION',
  Abandon.AbandonEvent & Event
>;

export type AbandonNotificationDependencies = {
  récupérerCandidature: RécupérerCandidaturePort;
  récupérerPorteursProjet: RécupérerPorteursProjetPort;
};

export const registerLauréatAbandonNotification = ({
  récupérerCandidature,
  récupérerPorteursProjet,
}: AbandonNotificationDependencies) => {
  const handler: MessageHandler<ExecuteLauréatAbandonNotification> = async (event) => {
    switch (event.type) {
      case 'AbandonAccordé-V1':
        const identifiantProjet = IdentifiantProjet.convertirEnValueType(
          event.payload.identifiantProjet,
        );
        const projet = await récupérerCandidature(identifiantProjet.formatter());

        if (isSome(projet)) {
          const urlTransmettrePreuveRecandidature = `/laureat/${encodeURIComponent(
            identifiantProjet.formatter(),
          )}/abandon/preuve-recandidature`;
          const porteurs = await récupérerPorteursProjet(identifiantProjet);

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
