import { Message, MessageHandler, mediator } from 'mediateur';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DémarrerInstructionDemandeMainlevéeGarantiesFinancièresCommand } from './démarrerInstructionDemandeMainlevéeGarantiesFinancières.command';

export type DémarrerInstructionDemandeMainlevéeGarantiesFinancièresUseCase = Message<
  'Lauréat.GarantiesFinancières.Mainlevée.UseCase.DémarrerInstruction',
  {
    identifiantProjetValue: string;
    démarréLeValue: string;
    démarréParValue: string;
  }
>;

export const registerDémarrerInstructionDemandeMainlevéeGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<
    DémarrerInstructionDemandeMainlevéeGarantiesFinancièresUseCase
  > = async ({ identifiantProjetValue, démarréLeValue, démarréParValue }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const démarréLe = DateTime.convertirEnValueType(démarréLeValue);
    const démarréPar = Email.convertirEnValueType(démarréParValue);

    await mediator.send<DémarrerInstructionDemandeMainlevéeGarantiesFinancièresCommand>({
      type: 'Lauréat.GarantiesFinancières.Mainlevée.Command.DémarrerInstruction',
      data: {
        démarréLe,
        démarréPar,
        identifiantProjet,
      },
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.Mainlevée.UseCase.DémarrerInstruction', runner);
};
