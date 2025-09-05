import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../..';

import { AnnulerMainlevéeGarantiesFinancièresCommand } from './annulerDemandeMainlevéeGarantiesFinancières.command';

export type AnnulerMainlevéeGarantiesFinancièresUseCase = Message<
  'Lauréat.GarantiesFinancières.UseCase.AnnulerMainlevée',
  {
    identifiantProjetValue: string;
    annuléLeValue: string;
    annuléParValue: string;
  }
>;

export const registerAnnulerMainlevéeGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<AnnulerMainlevéeGarantiesFinancièresUseCase> = async ({
    identifiantProjetValue,
    annuléLeValue,
    annuléParValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const annuléLe = DateTime.convertirEnValueType(annuléLeValue);
    const annuléPar = Email.convertirEnValueType(annuléParValue);

    await mediator.send<AnnulerMainlevéeGarantiesFinancièresCommand>({
      type: 'Lauréat.GarantiesFinancières.Command.AnnulerMainlevée',
      data: {
        identifiantProjet,
        annuléLe,
        annuléPar,
      },
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.UseCase.AnnulerMainlevée', runner);
};
