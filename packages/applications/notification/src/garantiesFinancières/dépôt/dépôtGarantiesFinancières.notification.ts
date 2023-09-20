import { DépôtGarantiesFinancièresEvent } from '@potentiel/domain';
// import { RécupérerDétailProjetPort } from '@potentiel/domain-views';
import { Message, MessageHandler, mediator } from 'mediateur';
import { sendEmail } from '../../sendEmail';

export type ExecuteDépôtGarantiesFinancièresNotification = Message<
  'EXECUTE_DÉPÔT_GARANTIES_FINANCIÈRES_NOTIFICATION',
  DépôtGarantiesFinancièresEvent
>;

export type DépôtGarantiesFinancièresNotificationDependencies = {
  //   récupérerDétailProjet: RécupérerDétailProjetPort;
};

export const registerDépôtGarantiesFinancièresNotification = ({}: //   récupérerDétailProjet,
DépôtGarantiesFinancièresNotificationDependencies) => {
  const handler: MessageHandler<ExecuteDépôtGarantiesFinancièresNotification> = async (event) => {
    switch (event.type) {
      case 'DépôtGarantiesFinancièresValidé-v1':
        sendEmail(event);
        break;
    }
  };

  mediator.register('EXECUTE_DÉPÔT_GARANTIES_FINANCIÈRES_NOTIFICATION', handler);
};
