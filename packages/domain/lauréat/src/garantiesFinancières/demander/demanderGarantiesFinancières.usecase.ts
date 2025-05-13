import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { DemanderGarantiesFinancièresCommand } from './demanderGarantiesFinancières.command';

export type DemanderGarantiesFinancièresUseCase = Message<
  'Lauréat.GarantiesFinancières.UseCase.DemanderGarantiesFinancières',
  {
    identifiantProjetValue: string;
    dateLimiteSoumissionValue: string;
    demandéLeValue: string;
    motifValue: string;
  }
>;

export const registerDemanderGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<DemanderGarantiesFinancièresUseCase> = async ({
    identifiantProjetValue,
    dateLimiteSoumissionValue,
    demandéLeValue,
    motifValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateLimiteSoumission = DateTime.convertirEnValueType(dateLimiteSoumissionValue);
    const demandéLe = DateTime.convertirEnValueType(demandéLeValue);
    const motif =
      Lauréat.GarantiesFinancières.MotifDemandeGarantiesFinancières.convertirEnValueType(
        motifValue,
      );

    await mediator.send<DemanderGarantiesFinancièresCommand>({
      type: 'Lauréat.GarantiesFinancières.Command.DemanderGarantiesFinancières',
      data: {
        dateLimiteSoumission,
        identifiantProjet,
        demandéLe,
        motif,
      },
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.UseCase.DemanderGarantiesFinancières', runner);
};
