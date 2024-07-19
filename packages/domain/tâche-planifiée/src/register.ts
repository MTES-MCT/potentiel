import { LoadAggregate } from '@potentiel-domain/core';

import { registerAjouterTâchePlanifiéeCommand } from './ajouter/ajouterTâchePlanifiée.command';
import {
  registerListerTâchesPlanifiéesQuery,
  ListerTâchesPlanifiéesQueryDependencies,
} from './lister/listerTâchesPlanifiées.query';
import { registerAnnulerTâchePlanifiéeCommand } from './annuler/annulerTâchePlanifiée.command';
import { registerExécuterTâchePlanifiéeCommand } from './exécuter/exécuter.command';
import { registerExécuterTâchePlanifiéeUseCase } from './exécuter/exécuter.usecase';

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
