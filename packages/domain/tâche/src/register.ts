import { LoadAggregate } from '@potentiel-domain/core';
import { registerAjouterTâcheCommand } from './ajouter/ajouterTâche.command';
import { registerAcheverTâcheCommand } from './achever/acheverTâche.command';
import {
  ConsulterNombreTâchesQueryDependencies,
  registerConsulterNombreTâchesQuery,
} from './consulter/consulterNombreTâches.query';

export type TâcheQueryDependencies = ConsulterNombreTâchesQueryDependencies;
export type TâcheCommandDependencies = {
  loadAggregate: LoadAggregate;
};

export const registerTâcheQuery = (dependencies: TâcheQueryDependencies) => {
  registerConsulterNombreTâchesQuery(dependencies);
};

export const registerTâcheCommand = ({ loadAggregate }: TâcheCommandDependencies) => {
  registerAjouterTâcheCommand(loadAggregate);
  registerAcheverTâcheCommand(loadAggregate);
};
