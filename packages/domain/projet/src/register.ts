import {
  type AccèsCommandDependencies,
  type AccèsQueryDependencies,
  registerAccèsQueries,
  registerAccèsUseCases,
} from './accès/accès.register.js';
import {
  type CandiatureCommandDependencies,
  type CandidatureQueryDependencies,
  registerCandidatureQueries,
  registerCandidaturesUseCases,
} from './candidature/index.js';
import {
  type LauréatCommandDependencies,
  type LauréatQueryDependencies,
  registerLauréatQueries,
  registerLauréatUseCases,
} from './lauréat/lauréat.register.js';
import {
  type EliminéCommandDependencies,
  type EliminéQueryDependencies,
  registerEliminéQueries,
  registerEliminéUseCases,
} from './éliminé/éliminé.register.js';

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
