import { GetProjetAggregateRoot } from '../..';

import {
  registerListerTâchesPlanifiéesQuery,
  ListerTâchesPlanifiéesQueryDependencies,
} from './lister/listerTâchesPlanifiées.query';
import { registerExécuterTâchePlanifiéeCommand } from './exécuter/exécuterTâchePlanifiée.command';
import { registerExécuterTâchePlanifiéeUseCase } from './exécuter/exécuterTâchePlanifiée.usecase';
import { registerAjouterTâchePlanifiéeCommand } from './ajouter/ajouterTâchePlanifiée.command';
import { registerAnnulerTâchePlanifiéeCommand } from './annuler/annulerTâchePlanifiée.command';
import { registerAnnulerTâchePlanifiéeUseCase } from './annuler/annulerTâchePlanifiée.usecase';

export type TâchePlanifiéeQueryDependencies = ListerTâchesPlanifiéesQueryDependencies;

export type TâchePlanifiéeCommandDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerTâchePlanifiéeQuery = (dependencies: TâchePlanifiéeQueryDependencies) => {
  registerListerTâchesPlanifiéesQuery(dependencies);
};

export const registerTâchePlanifiéeUseCases = ({
  getProjetAggregateRoot,
}: TâchePlanifiéeCommandDependencies) => {
  registerExécuterTâchePlanifiéeCommand(getProjetAggregateRoot);
  registerExécuterTâchePlanifiéeUseCase();

  registerAnnulerTâchePlanifiéeCommand(getProjetAggregateRoot);
  registerAnnulerTâchePlanifiéeUseCase();

  registerAjouterTâchePlanifiéeCommand(getProjetAggregateRoot);
};
