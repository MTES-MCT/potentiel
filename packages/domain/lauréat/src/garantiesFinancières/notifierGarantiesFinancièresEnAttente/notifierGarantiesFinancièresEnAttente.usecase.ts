import { Message, MessageHandler, mediator } from 'mediateur';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { NotifierGarantiesFinancièresEnAttenteCommand } from './notifierGarantiesFinancièresEnAttente.command';

export type NotifierGarantiesFinancièresEnAttenteUseCase = Message<
  'NOTIFIER_GARANTIES_FINANCIÈRES_EN_ATTENTE_USECASE',
  {
    identifiantProjetValue: string;
    dateLimiteSoumissionValue: string;
    notifiéLeValue: string;
  }
>;

export const registerNotifierGarantiesFinancièresEnAttenteUseCase = () => {
  const runner: MessageHandler<NotifierGarantiesFinancièresEnAttenteUseCase> = async ({
    identifiantProjetValue,
    dateLimiteSoumissionValue,
    notifiéLeValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateLimiteSoumission = DateTime.convertirEnValueType(dateLimiteSoumissionValue);
    const notifiéLe = DateTime.convertirEnValueType(notifiéLeValue);

    await mediator.send<NotifierGarantiesFinancièresEnAttenteCommand>({
      type: 'NOTIFIER_GARANTIES_FINANCIÈRES_EN_ATTENTE_COMMAND',
      data: {
        dateLimiteSoumission,
        identifiantProjet,
        notifiéLe,
      },
    });
  };
  mediator.register('NOTIFIER_GARANTIES_FINANCIÈRES_EN_ATTENTE_USECASE', runner);
};
