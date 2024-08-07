import {
  AbandonCommandDependencies,
  AbandonQueryDependencies,
  registerAbandonQueries,
  registerAbandonUseCases,
} from './abandon/abandon.register';
import {
  AchèvementCommandDependencies,
  AchèvementQueryDependencies,
  registerAchèvementQueries,
  registerAchèvementUseCases,
} from './achèvement/achèvement.register';
import {
  CahierDesChargesChoisiQueryDependencies,
  registerCahierDesChargesChoisiQueries,
} from './cahierDesChargesChoisi/cahierDesChargesChoisi.register';
import {
  GarantiesFinancièresCommandDependencies,
  GarantiesFinancièresQueryDependencies,
  registerGarantiesFinancièresQueries,
  registerGarantiesFinancièresUseCases,
} from './garantiesFinancières/garantiesFinancières.register';

export type LauréatQueryDependencies = AbandonQueryDependencies &
  CahierDesChargesChoisiQueryDependencies &
  GarantiesFinancièresQueryDependencies &
  AchèvementQueryDependencies;
export type LauréatCommandDependencies = AbandonCommandDependencies &
  GarantiesFinancièresCommandDependencies &
  AchèvementCommandDependencies;

export const registerLauréatUseCases = (dependencies: LauréatCommandDependencies) => {
  registerAbandonUseCases(dependencies);
  registerGarantiesFinancièresUseCases(dependencies);
  registerAchèvementUseCases(dependencies);
};

export const registerLauréatQueries = (dependencies: LauréatQueryDependencies) => {
  registerAbandonQueries(dependencies);
  registerCahierDesChargesChoisiQueries(dependencies);
  registerGarantiesFinancièresQueries(dependencies);
  registerAchèvementQueries(dependencies);
};
