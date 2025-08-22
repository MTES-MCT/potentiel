import type { GetProjetAggregateRoot } from '../..';
import { registerExécuterTâchePlanifiéeCommand } from './exécuter/exécuterTâchePlanifiée.command';
import { registerExécuterTâchePlanifiéeUseCase } from './exécuter/exécuterTâchePlanifiée.usecase';
import {
  type ListerTâchesPlanifiéesQueryDependencies,
  registerListerTâchesPlanifiéesQuery,
} from './lister/listerTâchesPlanifiées.query';

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
};
