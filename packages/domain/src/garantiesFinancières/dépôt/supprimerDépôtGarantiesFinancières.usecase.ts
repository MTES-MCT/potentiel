import { Message, MessageHandler, mediator } from 'mediateur';
import { SupprimerDépôtGarantiesFinancièresCommand } from './supprimerDépôtGarantiesFinancières.command';

type SupprimerDépGarantiesFinancièresUseCaseData =
  SupprimerDépôtGarantiesFinancièresCommand['data'];

export type SupprimerDépôtGarantiesFinancièresUseCase = Message<
  'SUPPRIMER_DÉPÔT_GARANTIES_FINANCIÈRES_USE_CASE',
  SupprimerDépGarantiesFinancièresUseCaseData
>;

export const registerSupprimerDépôtGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<SupprimerDépôtGarantiesFinancièresUseCase> = async ({
    identifiantProjet,
  }) => {
    await mediator.send<SupprimerDépôtGarantiesFinancièresCommand>({
      type: 'SUPPRIMER_DÉPÔT_GARANTIES_FINANCIÈRES',
      data: {
        identifiantProjet,
      },
    });
  };

  mediator.register('SUPPRIMER_DÉPÔT_GARANTIES_FINANCIÈRES_USE_CASE', runner);
};
