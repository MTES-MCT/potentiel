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
import {
  PuissanceCommandDependencies,
  PuissanceQueryDependencies,
  registerPuissanceQueries,
  registerPuissanceUseCases,
} from './puissance/puissance.register';
import {
  ProducteurCommandDependencies,
  ProducteurQueryDependencies,
  registerProducteurQueries,
  registerProducteurUseCases,
} from './producteur/producteur.register';

export type LauréatQueryDependencies = AbandonQueryDependencies &
  GarantiesFinancièresQueryDependencies &
  AchèvementQueryDependencies &
  ReprésentantLégalQueryDependencies &
  ActionnaireQueryDependencies &
  RaccordementQueryDependencies &
  PuissanceQueryDependencies &
  ProducteurQueryDependencies;

export type LauréatCommandDependencies = AbandonCommandDependencies &
  GarantiesFinancièresCommandDependencies &
  AchèvementCommandDependencies &
  ReprésentantLégalCommandDependencies &
  ActionnaireCommandDependencies &
  RaccordementCommandDependencies &
  PuissanceCommandDependencies &
  ProducteurCommandDependencies;

export const registerLauréatUseCases = (dependencies: LauréatCommandDependencies) => {
  registerAbandonUseCases(dependencies);
  registerGarantiesFinancièresUseCases(dependencies);
  registerAchèvementUseCases(dependencies);
  registerReprésentantLégalUseCases(dependencies);
  registerActionnaireUseCases(dependencies);
  registerRaccordementUseCases(dependencies);
  registerPuissanceUseCases(dependencies);
  registerProducteurUseCases(dependencies);
};

export const registerLauréatQueries = (dependencies: LauréatQueryDependencies) => {
  registerAbandonQueries(dependencies);
  registerGarantiesFinancièresQueries(dependencies);
  registerAchèvementQueries(dependencies);
  registerReprésentantLégalQueries(dependencies);
  registerActionnaireQueries(dependencies);
  registerRaccordementQueries(dependencies);
  registerPuissanceQueries(dependencies);
  registerProducteurQueries(dependencies);
};
