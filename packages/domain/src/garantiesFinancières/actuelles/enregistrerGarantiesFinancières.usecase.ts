import { Message, MessageHandler, mediator } from 'mediateur';
import { EnregistrerGarantiesFinancièresCommand } from './enregistrerGarantiesFinancières.command';

type EnregistrerGarantiesFinancièresUseCaseData = EnregistrerGarantiesFinancièresCommand['data'];

export type EnregistrerGarantiesFinancièresUseCase = Message<
  'ENREGISTRER_GARANTIES_FINANCIÈRES_USE_CASE',
  EnregistrerGarantiesFinancièresUseCaseData
>;

export const registerEnregistrerGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<EnregistrerGarantiesFinancièresUseCase> = async (message) => {
    await mediator.send<EnregistrerGarantiesFinancièresCommand>({
      type: 'ENREGISTER_GARANTIES_FINANCIÈRES',
      data: message,
    });
  };

  mediator.register('ENREGISTRER_GARANTIES_FINANCIÈRES_USE_CASE', runner);
};
