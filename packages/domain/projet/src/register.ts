import {
  AccèsCommandDependencies,
  AccèsQueryDependencies,
  registerAccèsQueries,
  registerAccèsUseCases,
} from './accès/accès.register';
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
  LauréatQueryDependencies &
  AccèsQueryDependencies;

export type ProjetCommandDependencies = EliminéCommandDependencies &
  CandiatureCommandDependencies &
  LauréatCommandDependencies &
  AccèsCommandDependencies;

export const registerProjetUseCases = (dependencies: ProjetCommandDependencies) => {
  registerAccèsUseCases(dependencies);
  registerCandidaturesUseCases(dependencies);
  registerEliminéUseCases(dependencies);
  registerLauréatUseCases(dependencies);
};

export const registerProjetQueries = (dependencies: ProjetQueryDependencies) => {
  registerAccèsQueries(dependencies);
  registerCandidatureQueries(dependencies);
  registerEliminéQueries(dependencies);
  registerLauréatQueries(dependencies);
};
