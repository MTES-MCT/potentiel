// import { RécupérerDétailProjetPort } from '@potentiel/domain-views';
import { Message, MessageHandler, mediator } from 'mediateur';
import { sendEmail } from '@potentiel/email-sender';
import { AbandonEvent } from '@potentiel/domain';

export type ExecuteAbandonProjetNotification = Message<
  'EXECUTE_ABANDON_PROJET_NOTIFICATION',
  AbandonEvent
>;

export type AbandonProjetNotificationDependencies = {
  //   récupérerDétailProjet: RécupérerDétailProjetPort;
};

export const registerAbandonProjetNotification = ({}: //   récupérerDétailProjet,
AbandonProjetNotificationDependencies) => {
  const handler: MessageHandler<ExecuteAbandonProjetNotification> = async (event) => {
    switch (event.type) {
      case 'AbandonDemandé':
        sendEmail({
          templateId: 12345678910,
          message: {
            object: 'Abandon du projet',
            recipients: [],
          },
          variables: {},
        });
        break;
    }
  };

  mediator.register('EXECUTE_ABANDON_PROJET_NOTIFICATION', handler);
};
