import {
  RécupérerCandidatureLegacyPort,
  RécupérerPorteursProjetPort,
} from '@potentiel/domain-views';
import { Message, MessageHandler, mediator } from 'mediateur';
import { sendEmail } from '@potentiel/email-sender';
import { convertirEnIdentifiantProjet } from '@potentiel/domain';
import { isSome } from '@potentiel/monads';
import { QuelqueChoseSestPasséEvent } from './exemple.event';

export type ExecuteProjetNotification = Message<
  'EXECUTE_PROJET_NOTIFICATION',
  QuelqueChoseSestPasséEvent
>;

export type ProjetNotificationDependencies = {
  récupérerCandidatureLegacy: RécupérerCandidatureLegacyPort;
  récupérerPorteursProjet: RécupérerPorteursProjetPort;
};

export const registerProjetNotification = ({
  récupérerCandidatureLegacy,
  récupérerPorteursProjet,
}: ProjetNotificationDependencies) => {
  const handler: MessageHandler<ExecuteProjetNotification> = async (event) => {
    switch (event.type) {
      case 'QuelqueChoseSestPassé':
        const projet = await récupérerCandidatureLegacy(
          convertirEnIdentifiantProjet(event.payload.identifiantProjet),
        );

        if (isSome(projet)) {
          const urlProjet = `/projet/${encodeURIComponent(projet.legacyId)}/details.html`;
          const porteurs = await récupérerPorteursProjet(
            convertirEnIdentifiantProjet(event.payload.identifiantProjet),
          );

          sendEmail({
            templateId: 'TEMPLATE_ID',
            messageSubject: `Le projet ${projet.nom}`,
            recipients: porteurs,
            variables: {
              lien_projet: urlProjet,
            },
          });
        }
        break;
    }
  };

  mediator.register('EXECUTE_PROJET_NOTIFICATION', handler);
};
