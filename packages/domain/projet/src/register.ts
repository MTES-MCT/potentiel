import {
  EliminéCommandDependencies,
  EliminéQueryDependencies,
  registerEliminéQueries,
  registerEliminéUseCases,
} from './éliminé/éliminé.register';

export type ProjetQueryDependencies = EliminéQueryDependencies;
export type ProjetCommandDependencies = EliminéCommandDependencies;

export const registerProjetUseCases = (dependencies: EliminéCommandDependencies) => {
  registerEliminéUseCases(dependencies);
};

export const registerProjetQueries = (dependencies: EliminéQueryDependencies) => {
  registerEliminéQueries(dependencies);
};
