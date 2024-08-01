import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { AjouterTâcheCommand } from '@potentiel-domain/tache';

import { MotifDemandeGarantiesFinancières } from '..';
import * as TypeTâcheGarantiesFinancières from '../typeTâcheGarantiesFinancières.valueType';

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
    const motif = MotifDemandeGarantiesFinancières.convertirEnValueType(motifValue);

    await mediator.send<DemanderGarantiesFinancièresCommand>({
      type: 'Lauréat.GarantiesFinancières.Command.DemanderGarantiesFinancières',
      data: {
        dateLimiteSoumission,
        identifiantProjet,
        demandéLe,
        motif,
      },
    });

    await mediator.send<AjouterTâcheCommand>({
      type: 'System.Tâche.Command.AjouterTâche',
      data: {
        identifiantProjet,
        typeTâche: TypeTâcheGarantiesFinancières.garantiesFinancieresDemander,
      },
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.UseCase.DemanderGarantiesFinancières', runner);
};
