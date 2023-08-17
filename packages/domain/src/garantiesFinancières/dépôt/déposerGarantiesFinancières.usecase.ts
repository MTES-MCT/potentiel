import { Message, MessageHandler, mediator } from 'mediateur';
import { DéposerGarantiesFinancièresCommand } from './déposerGarantiesFinancières.command';

type DéposerGarantiesFinancièresUseCaseData = DéposerGarantiesFinancièresCommand['data'];

export type DéposerGarantiesFinancièresUseCase = Message<
  'DÉPOSER_GARANTIES_FINANCIÈRES_USE_CASE',
  DéposerGarantiesFinancièresUseCaseData
>;

export const registerDéposerGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<DéposerGarantiesFinancièresUseCase> = async ({
    typeGarantiesFinancières,
    dateÉchéance,
    attestationConstitution,
    identifiantProjet,
    utilisateur,
    dateDépôt,
  }) => {
    await mediator.send<DéposerGarantiesFinancièresCommand>({
      type: 'DÉPOSER_GARANTIES_FINANCIÈRES',
      data: {
        attestationConstitution,
        identifiantProjet,
        typeGarantiesFinancières,
        utilisateur,
        dateÉchéance,
        dateDépôt,
      },
    });
  };

  mediator.register('DÉPOSER_GARANTIES_FINANCIÈRES_USE_CASE', runner);
};
