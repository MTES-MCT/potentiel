import { Message, MessageHandler, mediator } from 'mediateur';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { AnnulerMainLevéeGarantiesFinancièresCommand } from './annulerMainLevéeGarantiesFinancières.command';

export type AnnulerMainLevéeGarantiesFinancièresUseCase = Message<
  'Lauréat.GarantiesFinancières.MainLevée.UseCase.Annuler',
  {
    identifiantProjetValue: string;
  }
>;

export const registerAnnulerMainLevéeGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<AnnulerMainLevéeGarantiesFinancièresUseCase> = async ({
    identifiantProjetValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    await mediator.send<AnnulerMainLevéeGarantiesFinancièresCommand>({
      type: 'Lauréat.GarantiesFinancières.MainLevée.Command.Annuler',
      data: {
        identifiantProjet,
      },
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.MainLevée.UseCase.Annuler', runner);
};
