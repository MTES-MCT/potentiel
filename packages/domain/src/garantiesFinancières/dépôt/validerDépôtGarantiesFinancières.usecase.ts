import { Message, MessageHandler, mediator } from 'mediateur';
import { ValiderDépôtGarantiesFinancièresCommand } from './validerDépôtGarantiesFinancières.command';
import { EnregistrerGarantiesFinancièresCommand } from '../actuelles/enregistrerGarantiesFinancières.command';

type ValiderDépôtGarantiesFinancièresUseCaseData = ValiderDépôtGarantiesFinancièresCommand['data'] &
  EnregistrerGarantiesFinancièresCommand['data'];

export type ValiderDépôtGarantiesFinancièresUseCase = Message<
  'VALIDER_DÉPÔT_GARANTIES_FINANCIÈRES_USE_CASE',
  ValiderDépôtGarantiesFinancièresUseCaseData
>;

export const registerValiderDépôtGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<ValiderDépôtGarantiesFinancièresUseCase> = async (message) => {
    await mediator.send<ValiderDépôtGarantiesFinancièresCommand>({
      type: 'VALIDER_DÉPÔT_GARANTIES_FINANCIÈRES',
      data: {
        identifiantProjet: message.identifiantProjet,
      },
    });

    await mediator.send<EnregistrerGarantiesFinancièresCommand>({
      type: 'ENREGISTER_GARANTIES_FINANCIÈRES',
      data: message,
    });
  };

  mediator.register('VALIDER_DÉPÔT_GARANTIES_FINANCIÈRES_USE_CASE', runner);
};
