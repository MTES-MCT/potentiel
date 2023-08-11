import { Message, MessageHandler, mediator } from 'mediateur';
import { ModifierDépôtGarantiesFinancièresCommand } from './modifierDépôtGarantiesFinancières.command';

type ModifierDépôtGarantiesFinancièresUseCaseData =
  ModifierDépôtGarantiesFinancièresCommand['data'];

export type ModifierDépôtGarantiesFinancièresUseCase = Message<
  'MODIFIER_DÉPÔT_GARANTIES_FINANCIÈRES_USE_CASE',
  ModifierDépôtGarantiesFinancièresUseCaseData
>;

export const registerModifierDépôtGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<ModifierDépôtGarantiesFinancièresUseCase> = async ({
    typeGarantiesFinancières,
    dateÉchéance,
    attestationConstitution,
    identifiantProjet,
    utilisateur,
  }) => {
    await mediator.send<ModifierDépôtGarantiesFinancièresCommand>({
      type: 'MODIFIER_DÉPÔT_GARANTIES_FINANCIÈRES',
      data: {
        attestationConstitution,
        identifiantProjet,
        typeGarantiesFinancières,
        utilisateur,
        dateÉchéance,
      },
    });
  };

  mediator.register('MODIFIER_DÉPÔT_GARANTIES_FINANCIÈRES_USE_CASE', runner);
};
