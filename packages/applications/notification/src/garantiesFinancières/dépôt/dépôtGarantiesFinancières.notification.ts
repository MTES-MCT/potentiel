import { DépôtGarantiesFinancièresEvent } from '@potentiel/domain';
// import { RécupérerDétailProjetPort } from '@potentiel/domain-views';
import { Message, MessageHandler, mediator } from 'mediateur';
import { sendEmail } from '@potentiel/email-sender';

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
        sendEmail({
          type: 'notifier-pp-gf-validé',
          templateId: 12345678910,
          contexte: {
            identifiantProjet: identifiantProjet.formatter(),
          },
          message: {
            object: 'Validation du dépôt des des garanties financières',
            recipients: porteursÀNotifier,
          },
          variables: {
            nomProjet,
            // TODO : récupérer la dreal dans un adapter ou depuis une query dans le controller ?
            dreal: 'TEST',
            dateDépôt: format(new Date(), 'dd/MM/yyyy'),
          },
        });
        break;
    }
  };

  mediator.register('EXECUTE_DÉPÔT_GARANTIES_FINANCIÈRES_NOTIFICATION', handler);
};
