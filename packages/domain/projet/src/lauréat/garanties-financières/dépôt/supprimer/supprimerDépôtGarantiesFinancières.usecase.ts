import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

import { SupprimerDépôtGarantiesFinancièresCommand } from './supprimerDépôtGarantiesFinancières.command';

export type SupprimerDépôtGarantiesFinancièresUseCase = Message<
  'Lauréat.GarantiesFinancières.UseCase.SupprimerDépôtGarantiesFinancières',
  {
    identifiantProjetValue: string;
    suppriméLeValue: string;
    suppriméParValue: string;
  }
>;

export const registerSupprimerDépôtGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<SupprimerDépôtGarantiesFinancièresUseCase> = async ({
    identifiantProjetValue,
    suppriméLeValue,
    suppriméParValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const suppriméLe = DateTime.convertirEnValueType(suppriméLeValue);
    const suppriméPar = IdentifiantUtilisateur.convertirEnValueType(suppriméParValue);

    await mediator.send<SupprimerDépôtGarantiesFinancièresCommand>({
      type: 'Lauréat.GarantiesFinancières.Command.SupprimerDépôtGarantiesFinancières',
      data: {
        identifiantProjet,
        suppriméLe,
        suppriméPar,
      },
    });
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.UseCase.SupprimerDépôtGarantiesFinancières',
    runner,
  );
};
