import {
  AbandonQueryDependencies,
  AbandonUseCaseDependencies,
  registerAbandonQueries,
  registerAbandonUseCases,
} from './abandon/abandon.register';

export type LauréatUseCaseDependencies = AbandonUseCaseDependencies;
export type LauréatQueryDependencies = AbandonQueryDependencies;

export const registerLauréatUseCases = (dependencies: LauréatUseCaseDependencies) => {
  registerAbandonUseCases(dependencies);
};

export const registerLauréatQueries = (dependencies: LauréatQueryDependencies) => {
  registerAbandonQueries(dependencies);
};
