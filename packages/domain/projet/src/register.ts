import {
  CandiatureCommandDependencies,
  CandidatureQueryDependencies,
  registerCandidatureQueries,
  registerCandidaturesUseCases,
} from './candidature';
import {
  EliminéCommandDependencies,
  EliminéQueryDependencies,
  registerEliminéQueries,
  registerEliminéUseCases,
} from './éliminé/éliminé.register';

export type ProjetQueryDependencies = EliminéQueryDependencies & CandidatureQueryDependencies;
export type ProjetCommandDependencies = EliminéCommandDependencies & CandiatureCommandDependencies;

export const registerProjetUseCases = (dependencies: ProjetCommandDependencies) => {
  registerCandidaturesUseCases(dependencies);
  registerEliminéUseCases(dependencies);
};

export const registerProjetQueries = (dependencies: ProjetQueryDependencies) => {
  registerCandidatureQueries(dependencies);
  registerEliminéQueries(dependencies);
};
