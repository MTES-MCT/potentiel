import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../../index.js';
import { MotifDemandeMainlevéeGarantiesFinancières } from '../../index.js';

import { DemanderMainlevéeGarantiesFinancièresCommand } from './demanderMainlevéeGarantiesFinancières.command.js';

export type DemanderMainlevéeGarantiesFinancièresUseCase = Message<
  'Lauréat.GarantiesFinancières.UseCase.DemanderMainlevée',
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
    const motif = MotifDemandeMainlevéeGarantiesFinancières.convertirEnValueType(motifValue);
    const demandéLe = DateTime.convertirEnValueType(demandéLeValue);
    const demandéPar = Email.convertirEnValueType(demandéParValue);

    await mediator.send<DemanderMainlevéeGarantiesFinancièresCommand>({
      type: 'Lauréat.GarantiesFinancières.Command.DemanderMainlevée',
      data: {
        demandéLe,
        demandéPar,
        identifiantProjet,
        motif,
      },
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.UseCase.DemanderMainlevée', runner);
};
