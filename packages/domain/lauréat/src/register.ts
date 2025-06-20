import {
  GarantiesFinancièresCommandDependencies,
  GarantiesFinancièresQueryDependencies,
  registerGarantiesFinancièresQueries,
  registerGarantiesFinancièresUseCases,
} from './garantiesFinancières/garantiesFinancières.register';
import { registerReprésentantLégalQueries } from './représentantLégal';
import {
  registerReprésentantLégalUseCases,
  ReprésentantLégalCommandDependencies,
  ReprésentantLégalQueryDependencies,
} from './représentantLégal/représentantLégal.register';
import {
  RaccordementCommandDependencies,
  RaccordementQueryDependencies,
  registerRaccordementQueries,
  registerRaccordementUseCases,
} from './raccordement/raccordement.register';

export type LauréatQueryDependencies = GarantiesFinancièresQueryDependencies &
  ReprésentantLégalQueryDependencies &
  RaccordementQueryDependencies;

export type LauréatCommandDependencies = GarantiesFinancièresCommandDependencies &
  ReprésentantLégalCommandDependencies &
  RaccordementCommandDependencies;

export const registerLauréatUseCases = (dependencies: LauréatCommandDependencies) => {
  registerGarantiesFinancièresUseCases(dependencies);
  registerReprésentantLégalUseCases(dependencies);
  registerRaccordementUseCases(dependencies);
};

export const registerLauréatQueries = (dependencies: LauréatQueryDependencies) => {
  registerGarantiesFinancièresQueries(dependencies);
  registerReprésentantLégalQueries(dependencies);
  registerRaccordementQueries(dependencies);
};
