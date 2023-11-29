import {
  AbandonCommandDependencies,
  AbandonQueryDependencies,
  registerAbandonQueries,
  registerAbandonUseCases,
} from './abandon/abandon.register';
import {
  CahierDesChargesQueryDependencies,
  registerCahierDesChargesQueries,
} from './cahierDesCharges/cahierDesCharges.register';

export type LauréatQueryDependencies = AbandonQueryDependencies & CahierDesChargesQueryDependencies;
export type LauréatCommandDependencies = AbandonCommandDependencies;

export const registerLauréatUseCases = (dependencies: LauréatCommandDependencies) => {
  registerAbandonUseCases(dependencies);
};

export const registerLauréatQueries = (dependencies: LauréatQueryDependencies) => {
  registerAbandonQueries(dependencies);
  registerCahierDesChargesQueries(dependencies);
};
