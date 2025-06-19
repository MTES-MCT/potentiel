import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { DemanderMainlevéeGarantiesFinancièresCommand } from './demanderMainlevéeGarantiesFinancières.command';

export type DemanderMainlevéeGarantiesFinancièresUseCase = Message<
  'Lauréat.GarantiesFinancières.Mainlevée.UseCase.Demander',
  {
    identifiantProjetValue: string;
    motifValue: string;
    demandéLeValue: string;
    demandéParValue: string;
  }
>;

export const registerDemanderMainlevéeGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<DemanderMainlevéeGarantiesFinancièresUseCase> = async ({
    identifiantProjetValue,
    motifValue,
    demandéLeValue,
    demandéParValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const motif =
      Lauréat.GarantiesFinancières.MotifDemandeMainlevéeGarantiesFinancières.convertirEnValueType(
        motifValue,
      );
    const demandéLe = DateTime.convertirEnValueType(demandéLeValue);
    const demandéPar = Email.convertirEnValueType(demandéParValue);

    await mediator.send<DemanderMainlevéeGarantiesFinancièresCommand>({
      type: 'Lauréat.GarantiesFinancières.Mainlevée.Command.Demander',
      data: {
        demandéLe,
        demandéPar,
        identifiantProjet,
        motif,
      },
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.Mainlevée.UseCase.Demander', runner);
};
