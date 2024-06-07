import { Message, MessageHandler, mediator } from 'mediateur';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { AnnulerMainLevéeGarantiesFinancièresCommand } from './annulerDemandeMainLevéeGarantiesFinancières.command';

export type AnnulerMainLevéeGarantiesFinancièresUseCase = Message<
  'Lauréat.GarantiesFinancières.MainLevée.UseCase.Annuler',
  {
    identifiantProjetValue: string;
    annuléLeValue: string;
    annuléParValue: string;
  }
>;

export const registerAnnulerMainLevéeGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<AnnulerMainLevéeGarantiesFinancièresUseCase> = async ({
    identifiantProjetValue,
    annuléLeValue,
    annuléParValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const annuléLe = DateTime.convertirEnValueType(annuléLeValue);
    const annuléPar = Email.convertirEnValueType(annuléParValue);

    await mediator.send<AnnulerMainLevéeGarantiesFinancièresCommand>({
      type: 'Lauréat.GarantiesFinancières.MainLevée.Command.Annuler',
      data: {
        identifiantProjet,
        annuléLe,
        annuléPar,
      },
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.MainLevée.UseCase.Annuler', runner);
};
