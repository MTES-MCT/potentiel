import { Message, MessageHandler, mediator } from 'mediateur';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { MotifDemandeMainLevéeGarantiesFinancières } from '../..';
import { DemanderMainLevéeGarantiesFinancièresCommand } from './demanderMainLevéeGarantiesFinancières.command';
import { showMainLevéeGarantiesFinancières } from '@potentiel-applications/feature-flags';

export type DemanderMainLevéeGarantiesFinancièresUseCase = Message<
  'Lauréat.GarantiesFinancières.MainLevée.UseCase.Demander',
  {
    identifiantProjetValue: string;
    motifValue: string;
    demandéLeValue: string;
    demandéParValue: string;
  }
>;

export const registerDemanderMainLevéeGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<DemanderMainLevéeGarantiesFinancièresUseCase> = async ({
    identifiantProjetValue,
    motifValue,
    demandéLeValue,
    demandéParValue,
  }) => {
    if (showMainLevéeGarantiesFinancières) {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
      const motif = MotifDemandeMainLevéeGarantiesFinancières.convertirEnValueType(motifValue);
      const demandéLe = DateTime.convertirEnValueType(demandéLeValue);
      const demandéPar = Email.convertirEnValueType(demandéParValue);

      await mediator.send<DemanderMainLevéeGarantiesFinancièresCommand>({
        type: 'Lauréat.GarantiesFinancières.MainLevée.Command.Demander',
        data: {
          demandéLe,
          demandéPar,
          identifiantProjet,
          motif,
        },
      });
    }
  };
  mediator.register('Lauréat.GarantiesFinancières.MainLevée.UseCase.Demander', runner);
};
