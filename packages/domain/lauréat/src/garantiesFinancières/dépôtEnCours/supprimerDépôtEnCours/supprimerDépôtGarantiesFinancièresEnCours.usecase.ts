import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

import { AjouterTâchesPlanifiéesGarantiesFinancièresCommand } from '../../tâches-planifiées/ajouter/ajouter.command';

import { SupprimerDépôtGarantiesFinancièresEnCoursCommand } from './supprimerDépôtGarantiesFinancièresEnCours.command';

export type SupprimerGarantiesFinancièresÀTraiterUseCase = Message<
  'Lauréat.GarantiesFinancières.UseCase.SupprimerGarantiesFinancièresÀTraiter',
  {
    identifiantProjetValue: string;
    suppriméLeValue: string;
    suppriméParValue: string;
    dateÉchéanceValue?: string;
  }
>;

export const registerSupprimerGarantiesFinancièresÀTraiterUseCase = () => {
  const runner: MessageHandler<SupprimerGarantiesFinancièresÀTraiterUseCase> = async ({
    identifiantProjetValue,
    suppriméLeValue,
    suppriméParValue,
    dateÉchéanceValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const suppriméLe = DateTime.convertirEnValueType(suppriméLeValue);
    const suppriméPar = IdentifiantUtilisateur.convertirEnValueType(suppriméParValue);

    await mediator.send<SupprimerDépôtGarantiesFinancièresEnCoursCommand>({
      type: 'Lauréat.GarantiesFinancières.Command.SupprimerDépôtGarantiesFinancièresEnCours',
      data: {
        identifiantProjet,
        suppriméLe,
        suppriméPar,
      },
    });

    await mediator.send<AjouterTâchesPlanifiéesGarantiesFinancièresCommand>({
      type: 'Lauréat.GarantiesFinancières.Command.AjouterTâchesPlanifiées',
      data: {
        identifiantProjet,
        dateÉchéance: dateÉchéanceValue
          ? DateTime.convertirEnValueType(dateÉchéanceValue)
          : undefined,
      },
    });
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.UseCase.SupprimerGarantiesFinancièresÀTraiter',
    runner,
  );
};
