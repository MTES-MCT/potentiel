import { LoadAggregate } from '@potentiel-domain/core';
import { registerAjouterTâcheCommand } from './ajouter/ajouterTâche.command';
import { registerAcheverTâcheCommand } from './achever/acheverTâche.command';
import {
  ConsulterNombreTâchesQueryDependencies,
  registerConsulterNombreTâchesQuery,
} from './consulter/consulterNombreTâches.query';
import {
  ListerTâcheQueryDependencies,
  registerListerTâcheQuery,
} from './lister/listerTâches.query';

export type TâcheQueryDependencies = ConsulterNombreTâchesQueryDependencies &
  ListerTâcheQueryDependencies;
export type TâcheCommandDependencies = {
  loadAggregate: LoadAggregate;
};

export const registerTâcheQuery = (dependencies: TâcheQueryDependencies) => {
  registerConsulterNombreTâchesQuery(dependencies);
  registerListerTâcheQuery(dependencies);
};

export const registerTâcheCommand = ({ loadAggregate }: TâcheCommandDependencies) => {
  registerAjouterTâcheCommand(loadAggregate);
  registerAcheverTâcheCommand(loadAggregate);
};
