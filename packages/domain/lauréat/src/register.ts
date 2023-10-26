import {
  AbandonCommandDependencies,
  AbandonQueryDependencies,
  registerAbandonQueries,
  registerAbandonUseCases,
} from './abandon/abandon.register';

export type LauréatQueryDependencies = AbandonQueryDependencies;
export type LauréatCommandDependencies = AbandonCommandDependencies;

export const registerLauréatUseCases = (dependencies: LauréatCommandDependencies) => {
  registerAbandonUseCases(dependencies);
};

export const registerLauréatQueries = (dependencies: LauréatQueryDependencies) => {
  registerAbandonQueries(dependencies);
};
