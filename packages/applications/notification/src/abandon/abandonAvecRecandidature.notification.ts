import { RécupérerDétailProjetPort, RécupérerPorteursProjetPort } from '@potentiel/domain-views';
import { Message, MessageHandler, mediator } from 'mediateur';
import { sendEmail } from '@potentiel/email-sender';
import { AbandonEvent, convertirEnIdentifiantProjet } from '@potentiel/domain';
import { isSome } from '@potentiel/monads';

export type ExecuteAbandonProjetNotification = Message<
  'EXECUTE_ABANDON_PROJET_NOTIFICATION',
  AbandonEvent
>;

export type AbandonProjetNotificationDependencies = {
  récupérerDétailProjet: RécupérerDétailProjetPort;
  récupérerPorteursProjet: RécupérerPorteursProjetPort;
};

export const registerAbandonProjetNotification = ({
  récupérerDétailProjet,
  récupérerPorteursProjet,
}: AbandonProjetNotificationDependencies) => {
  const handler: MessageHandler<ExecuteAbandonProjetNotification> = async (event) => {
    switch (event.type) {
      case 'AbandonDemandé':
        const projet = await récupérerDétailProjet(
          convertirEnIdentifiantProjet(event.payload.identifiantProjet),
        );

        if (isSome(projet)) {
          const urlProjet = `/projet/${encodeURIComponent(projet.legacyId)}/details.html`;
          const porteurs = await récupérerPorteursProjet(
            convertirEnIdentifiantProjet(event.payload.identifiantProjet),
          );

          console.log(porteurs);
          // const porteurs: Array<{ email: string; name: string }> = [];

          sendEmail({
            templateId: '5126436',
            messageSubject: `Abandon du projet ${projet.nom}`,
            recipients: porteurs,
            variables: {
              lien_projet: urlProjet,
            },
          });
        }
        break;
    }
  };

  mediator.register('EXECUTE_ABANDON_PROJET_NOTIFICATION', handler);
};
