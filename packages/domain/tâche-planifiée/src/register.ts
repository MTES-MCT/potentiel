import { LoadAggregate } from '@potentiel-domain/core';

import { registerAjouterTâchePlanifiéeCommand } from './ajouter/ajouterTâchePlanifiée.command';
import {
  registerListerTâchesPlanifiéesQuery,
  ListerTâchesPlanifiéesQueryDependencies,
} from './lister/listerTâchesPlanifiées.query';
import { registerAnnulerTâchePlanifiéeCommand } from './annuler/annulerTâchePlanifiée.command';
import { registerExécuterTâchePlanifiéeCommand } from './exécuter/exécuterTâchePlanifiée.command';
import { registerExécuterTâchePlanifiéeUseCase } from './exécuter/exécuterTâchePlanifiée.usecase';

export type TâchePlanifiéeQueryDependencies = ListerTâchesPlanifiéesQueryDependencies;

export type TâchePlanifiéeCommandDependencies = {
  loadAggregate: LoadAggregate;
};

export const registerTâchePlanifiéeQuery = (dependencies: TâchePlanifiéeQueryDependencies) => {
  registerListerTâchesPlanifiéesQuery(dependencies);
};

export const registerTâchePlanifiéeUseCases = ({
  loadAggregate,
}: TâchePlanifiéeCommandDependencies) => {
  registerAjouterTâchePlanifiéeCommand(loadAggregate);
  registerAnnulerTâchePlanifiéeCommand(loadAggregate);
  registerExécuterTâchePlanifiéeCommand(loadAggregate);

  registerExécuterTâchePlanifiéeUseCase();
};
