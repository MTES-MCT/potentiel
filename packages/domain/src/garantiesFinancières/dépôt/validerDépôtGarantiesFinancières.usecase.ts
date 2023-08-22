import { Message, MessageHandler, mediator } from 'mediateur';
import { ValiderDépôtGarantiesFinancièresCommand } from './validerDépôtGarantiesFinancières.command';

type ValiderDépGarantiesFinancièresUseCaseData = ValiderDépôtGarantiesFinancièresCommand['data'];

export type ValiderDépôtGarantiesFinancièresUseCase = Message<
  'VALIDER_DÉPÔT_GARANTIES_FINANCIÈRES_USE_CASE',
  ValiderDépGarantiesFinancièresUseCaseData
>;

export const registerValiderDépôtGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<ValiderDépôtGarantiesFinancièresUseCase> = async ({
    identifiantProjet,
  }) => {
    await mediator.send<ValiderDépôtGarantiesFinancièresCommand>({
      type: 'VALIDER_DÉPÔT_GARANTIES_FINANCIÈRES',
      data: {
        identifiantProjet,
      },
    });
  };

  mediator.register('VALIDER_DÉPÔT_GARANTIES_FINANCIÈRES_USE_CASE', runner);
};
