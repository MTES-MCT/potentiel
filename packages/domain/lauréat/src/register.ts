import {
  AbandonCommandDependencies,
  AbandonQueryDependencies,
  registerAbandonQueries,
  registerAbandonUseCases,
} from './abandon/abandon.register';
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
  ActionnaireCommandDependencies,
  ActionnaireQueryDependencies,
  registerActionnaireQueries,
  registerActionnaireUseCases,
} from './actionnaire/actionnaire.register';
import {
  RaccordementCommandDependencies,
  RaccordementQueryDependencies,
  registerRaccordementQueries,
  registerRaccordementUseCases,
} from './raccordement/raccordement.register';

export type LauréatQueryDependencies = AbandonQueryDependencies &
  GarantiesFinancièresQueryDependencies &
  ReprésentantLégalQueryDependencies &
  ActionnaireQueryDependencies &
  RaccordementQueryDependencies;

export type LauréatCommandDependencies = AbandonCommandDependencies &
  GarantiesFinancièresCommandDependencies &
  ReprésentantLégalCommandDependencies &
  ActionnaireCommandDependencies &
  RaccordementCommandDependencies;

export const registerLauréatUseCases = (dependencies: LauréatCommandDependencies) => {
  registerAbandonUseCases(dependencies);
  registerGarantiesFinancièresUseCases(dependencies);
  registerReprésentantLégalUseCases(dependencies);
  registerActionnaireUseCases(dependencies);
  registerRaccordementUseCases(dependencies);
};

export const registerLauréatQueries = (dependencies: LauréatQueryDependencies) => {
  registerAbandonQueries(dependencies);
  registerGarantiesFinancièresQueries(dependencies);
  registerReprésentantLégalQueries(dependencies);
  registerActionnaireQueries(dependencies);
  registerRaccordementQueries(dependencies);
};
