import {
  AcheverTâcheCommandDependencies,
  registerAcheverTâcheCommand,
} from './achever/acheverTâche.command';
import {
  AjouterTâcheCommandDependencies,
  registerAjouterTâcheCommand,
} from './ajouter/ajouterTâche.command';
import {
  ConsulterNombreTâchesQueryDependencies,
  registerConsulterNombreTâchesQuery,
} from './consulter/consulterNombreTâche.query';
import {
  ListerTâchesQueryDependencies,
  registerListerTâchesQuery,
} from './lister/listerTâche.query';

export type TâcheQueryDependencies = ConsulterNombreTâchesQueryDependencies &
  ListerTâchesQueryDependencies;

export type TâcheCommandDependencies = AjouterTâcheCommandDependencies &
  AcheverTâcheCommandDependencies;

export const registerTâcheQuery = (dependencies: TâcheQueryDependencies) => {
  registerConsulterNombreTâchesQuery(dependencies);
  registerListerTâchesQuery(dependencies);
};

export const registerTâcheUseCases = (dependencies: TâcheCommandDependencies) => {
  registerAjouterTâcheCommand(dependencies);
  registerAcheverTâcheCommand(dependencies);
};
