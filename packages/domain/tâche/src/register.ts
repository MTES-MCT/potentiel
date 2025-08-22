import type { LoadAggregate } from '@potentiel-domain/core';

import { registerAcheverTâcheCommand } from './achever/acheverTâche.command';
import { registerAjouterTâcheCommand } from './ajouter/ajouterTâche.command';
import {
  type ConsulterNombreTâchesQueryDependencies,
  registerConsulterNombreTâchesQuery,
} from './consulter/consulterNombreTâches.query';
import {
  type ListerTâchesQueryDependencies,
  registerListerTâchesQuery,
} from './lister/listerTâches.query';

export type TâcheQueryDependencies = ConsulterNombreTâchesQueryDependencies &
  ListerTâchesQueryDependencies;
export type TâcheCommandDependencies = {
  loadAggregate: LoadAggregate;
};

export const registerTâcheQuery = (dependencies: TâcheQueryDependencies) => {
  registerConsulterNombreTâchesQuery(dependencies);
  registerListerTâchesQuery(dependencies);
};

export const registerTâcheCommand = ({ loadAggregate }: TâcheCommandDependencies) => {
  registerAjouterTâcheCommand(loadAggregate);
  registerAcheverTâcheCommand(loadAggregate);
};
