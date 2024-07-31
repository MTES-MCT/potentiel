import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { AjouterTâchePlanifiéeCommand } from '@potentiel-domain/tache-planifiee';

import * as TypeTâchePlanifiéeGarantiesFinancières from '../../typeTâchePlanifiéeGarantiesFinancières.valueType';

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

    if (dateÉchéanceValue) {
      await mediator.send<AjouterTâchePlanifiéeCommand>({
        type: 'System.TâchePlanifiée.Command.AjouterTâchePlanifiée',
        data: {
          identifiantProjet,
          tâches: [
            {
              typeTâchePlanifiée: TypeTâchePlanifiéeGarantiesFinancières.échoir.type,
              àExécuterLe: DateTime.convertirEnValueType(dateÉchéanceValue).ajouterNombreDeJours(1),
            },
            {
              typeTâchePlanifiée: TypeTâchePlanifiéeGarantiesFinancières.rappelÉchéanceUnMois.type,
              àExécuterLe: DateTime.convertirEnValueType(dateÉchéanceValue).retirerNombreDeMois(1),
            },
            {
              typeTâchePlanifiée:
                TypeTâchePlanifiéeGarantiesFinancières.rappelÉchéanceDeuxMois.type,
              àExécuterLe: DateTime.convertirEnValueType(dateÉchéanceValue).retirerNombreDeMois(2),
            },
          ],
        },
      });
    }
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.UseCase.SupprimerGarantiesFinancièresÀTraiter',
    runner,
  );
};
