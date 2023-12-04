import {
  AbandonCommandDependencies,
  AbandonQueryDependencies,
  registerAbandonQueries,
  registerAbandonUseCases,
} from './abandon/abandon.register';
import {
  CahierDesChargesChoisiQueryDependencies,
  registerCahierDesChargesChoisiQueries,
} from './cahierDesChargesChoisi/cahierDesChargesChoisi.register';

export type LauréatQueryDependencies = AbandonQueryDependencies &
  CahierDesChargesChoisiQueryDependencies;
export type LauréatCommandDependencies = AbandonCommandDependencies;

export const registerLauréatUseCases = (dependencies: LauréatCommandDependencies) => {
  registerAbandonUseCases(dependencies);
};

export const registerLauréatQueries = (dependencies: LauréatQueryDependencies) => {
  registerAbandonQueries(dependencies);
  registerCahierDesChargesChoisiQueries(dependencies);
};
