import { Message, MessageHandler, mediator } from 'mediateur';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { AnnulerMainlevéeGarantiesFinancièresCommand } from './annulerDemandeMainlevéeGarantiesFinancières.command';

export type AnnulerMainlevéeGarantiesFinancièresUseCase = Message<
  'Lauréat.GarantiesFinancières.Mainlevée.UseCase.Annuler',
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
      type: 'Lauréat.GarantiesFinancières.Mainlevée.Command.Annuler',
      data: {
        identifiantProjet,
        annuléLe,
        annuléPar,
      },
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.Mainlevée.UseCase.Annuler', runner);
};
