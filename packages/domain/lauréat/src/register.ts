import { LoadAggregateDependencies } from '@potentiel-domain/common';
import {
  AbandonQueryDependencies,
  registerAbandonQueries,
  registerAbandonUseCases,
} from './abandon/abandon.register';

export type LauréatQueryDependencies = AbandonQueryDependencies;

export const registerLauréatUseCases = (dependencies: LoadAggregateDependencies) => {
  registerAbandonUseCases(dependencies);
};

export const registerLauréatQueries = (dependencies: LauréatQueryDependencies) => {
  registerAbandonQueries(dependencies);
};
