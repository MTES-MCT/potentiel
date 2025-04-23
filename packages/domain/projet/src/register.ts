import {
  CandiatureCommandDependencies,
  CandidatureQueryDependencies,
  registerCandidatureQueries,
  registerCandidaturesUseCases,
} from './candidature';
import {
  LauréatCommandDependencies,
  LauréatQueryDependencies,
  registerLauréatQueries,
  registerLauréatUseCases,
} from './lauréat/lauréat.register';
import {
  EliminéCommandDependencies,
  EliminéQueryDependencies,
  registerEliminéQueries,
  registerEliminéUseCases,
} from './éliminé/éliminé.register';

export type ProjetQueryDependencies = EliminéQueryDependencies &
  CandidatureQueryDependencies &
  LauréatQueryDependencies;
export type ProjetCommandDependencies = EliminéCommandDependencies &
  CandiatureCommandDependencies &
  LauréatCommandDependencies;

export const registerProjetUseCases = (dependencies: ProjetCommandDependencies) => {
  registerCandidaturesUseCases(dependencies);
  registerEliminéUseCases(dependencies);
  registerLauréatUseCases(dependencies);
};

export const registerProjetQueries = (dependencies: ProjetQueryDependencies) => {
  registerCandidatureQueries(dependencies);
  registerEliminéQueries(dependencies);
  registerLauréatQueries(dependencies);
};
