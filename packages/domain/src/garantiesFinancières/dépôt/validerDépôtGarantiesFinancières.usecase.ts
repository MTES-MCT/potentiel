import { Message, MessageHandler, mediator } from 'mediateur';
import { ValiderDépôtGarantiesFinancièresCommand } from './validerDépôtGarantiesFinancières.command';
import { EnregistrerGarantiesFinancièresComplètesCommand } from '../actuelles/enregistrerGarantiesFinancièresComplètes.command';

type ValiderDépôtGarantiesFinancièresUseCaseData = ValiderDépôtGarantiesFinancièresCommand['data'] &
  EnregistrerGarantiesFinancièresComplètesCommand['data'];

export type ValiderDépôtGarantiesFinancièresUseCase = Message<
  'VALIDER_DÉPÔT_GARANTIES_FINANCIÈRES_USE_CASE',
  ValiderDépôtGarantiesFinancièresUseCaseData
>;

export const registerValiderDépôtGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<ValiderDépôtGarantiesFinancièresUseCase> = async ({
    identifiantProjet,
    typeGarantiesFinancières,
    dateÉchéance,
    attestationConstitution,
    utilisateur,
  }) => {
    await mediator.send<ValiderDépôtGarantiesFinancièresCommand>({
      type: 'VALIDER_DÉPÔT_GARANTIES_FINANCIÈRES',
      data: {
        identifiantProjet,
      },
    });

    await mediator.send<EnregistrerGarantiesFinancièresComplètesCommand>({
      type: 'ENREGISTER_GARANTIES_FINANCIÈRES_COMPLÈTES',
      data: {
        typeGarantiesFinancières,
        dateÉchéance,
        attestationConstitution,
        utilisateur,
        identifiantProjet,
      },
    });
  };

  mediator.register('VALIDER_DÉPÔT_GARANTIES_FINANCIÈRES_USE_CASE', runner);
};
