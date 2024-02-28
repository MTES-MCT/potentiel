import { Message, MessageHandler, mediator } from 'mediateur';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DemanderGarantiesFinancièresCommand } from './demanderGarantiesFinancières.command';

export type DemanderGarantiesFinancièresUseCase = Message<
  'Lauréat.GarantiesFinancières.UseCase.DemanderGarantiesFinancières',
  {
    identifiantProjetValue: string;
    dateLimiteSoumissionValue: string;
    demandéLeValue: string;
  }
>;

export const registerDemanderGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<DemanderGarantiesFinancièresUseCase> = async ({
    identifiantProjetValue,
    dateLimiteSoumissionValue,
    demandéLeValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateLimiteSoumission = DateTime.convertirEnValueType(dateLimiteSoumissionValue);
    const demandéLe = DateTime.convertirEnValueType(demandéLeValue);

    await mediator.send<DemanderGarantiesFinancièresCommand>({
      type: 'Lauréat.GarantiesFinancières.Command.DemanderGarantiesFinancières',
      data: {
        dateLimiteSoumission,
        identifiantProjet,
        demandéLe,
      },
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.UseCase.DemanderGarantiesFinancières', runner);
};
