import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

import { EffacerHistoriqueGarantiesFinancièresCommand } from './effacerHistoriqueGarantiesFinancières.command';

export type EffacerHistoriqueGarantiesFinancièresUseCase = Message<
  'Lauréat.GarantiesFinancières.UseCase.EffacerHistoriqueGarantiesFinancières',
  {
    identifiantProjetValue: string;
    effacéLeValue: string;
    effacéParValue: string;
  }
>;

export const registerEffacerHistoriqueGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<EffacerHistoriqueGarantiesFinancièresUseCase> = async ({
    identifiantProjetValue,
    effacéLeValue,
    effacéParValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const effacéLe = DateTime.convertirEnValueType(effacéLeValue);
    const effacéPar = IdentifiantUtilisateur.convertirEnValueType(effacéParValue);

    await mediator.send<EffacerHistoriqueGarantiesFinancièresCommand>({
      type: 'Lauréat.GarantiesFinancières.Command.EffacerHistoriqueGarantiesFinancières',
      data: {
        identifiantProjet,
        effacéLe,
        effacéPar,
      },
    });
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.UseCase.EffacerHistoriqueGarantiesFinancières',
    runner,
  );
};
