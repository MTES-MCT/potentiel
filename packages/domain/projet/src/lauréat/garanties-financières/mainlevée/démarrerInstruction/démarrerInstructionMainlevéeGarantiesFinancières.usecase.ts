import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../..';

import { DémarrerInstructionMainlevéeGarantiesFinancièresCommand } from './démarrerInstructionMainlevéeGarantiesFinancières.command';

export type DémarrerInstructionMainlevéeGarantiesFinancièresUseCase = Message<
  'Lauréat.GarantiesFinancières.UseCase.DémarrerInstructionMainlevée',
  {
    identifiantProjetValue: string;
    démarréLeValue: string;
    démarréParValue: string;
  }
>;

export const registerDémarrerInstructionMainlevéeGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<DémarrerInstructionMainlevéeGarantiesFinancièresUseCase> = async ({
    identifiantProjetValue,
    démarréLeValue,
    démarréParValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const démarréLe = DateTime.convertirEnValueType(démarréLeValue);
    const démarréPar = Email.convertirEnValueType(démarréParValue);

    await mediator.send<DémarrerInstructionMainlevéeGarantiesFinancièresCommand>({
      type: 'Lauréat.GarantiesFinancières.Command.DémarrerInstructionMainlevée',
      data: {
        démarréLe,
        démarréPar,
        identifiantProjet,
      },
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.UseCase.DémarrerInstructionMainlevée', runner);
};
