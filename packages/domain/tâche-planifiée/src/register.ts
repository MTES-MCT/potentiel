import { LoadAggregate } from '@potentiel-domain/core';

import { registerAjouterTâchePlanifiéeCommand } from './ajouter/ajouterTâchePlanifiée.command';
import {
  registerListerTâchesPlanifiéesQuery,
  ListerTâchesPlanifiéesQueryDependencies,
} from './lister/listerTâchesPlanifiées.query';
import { registerAnnulerTâchePlanifiéeCommand } from './annuler/annulerTâchePlanifiée.command';

export type TâchePlanifiéeQueryDependencies = ListerTâchesPlanifiéesQueryDependencies;

export type TâchePlanifiéeCommandDependencies = {
  loadAggregate: LoadAggregate;
};

export const registerTâchePlanifiéeQuery = (dependencies: TâchePlanifiéeQueryDependencies) => {
  registerListerTâchesPlanifiéesQuery(dependencies);
};

export const registerTâchePlanifiéeCommand = ({
  loadAggregate,
}: TâchePlanifiéeCommandDependencies) => {
  registerAjouterTâchePlanifiéeCommand(loadAggregate);
  registerAnnulerTâchePlanifiéeCommand(loadAggregate);
};
