import { GetProjetAggregateRoot } from '../../index.js';
import { registerAjouterTâchePlanifiéeCommand } from './ajouter/ajouterTâchePlanifiée.command.js';
import { registerAnnulerTâchePlanifiéeCommand } from './annuler/annulerTâchePlanifiée.command.js';
import { registerAnnulerTâchePlanifiéeUseCase } from './annuler/annulerTâchePlanifiée.usecase.js';
import { registerExécuterTâchePlanifiéeCommand } from './exécuter/exécuterTâchePlanifiée.command.js';
import { registerExécuterTâchePlanifiéeUseCase } from './exécuter/exécuterTâchePlanifiée.usecase.js';
import {
  ListerTâchesPlanifiéesQueryDependencies,
  registerListerTâchesPlanifiéesQuery,
} from './lister/listerTâchesPlanifiées.query.js';

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
