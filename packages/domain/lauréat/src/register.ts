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
import { registerConsulterLauréatQuery } from './consulter/consulterLauréat.query';
import {
  GarantiesFinancièresCommandDependencies,
  GarantiesFinancièresQueryDependencies,
  registerGarantiesFinancièresQueries,
  registerGarantiesFinancièresUseCases,
} from './garantiesFinancières/garantiesFinancières.register';
import { registerNotifierLauréatCommand } from './notifier/notifierLauréat.command';
import { registerNotifierLauréatUseCase } from './notifier/notifierLauréat.usecase';
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
import { registerModifierLauréatUseCase } from './modifier/modifierLauréat.usecase';
import { registerModifierLauréatCommand } from './modifier/modifierLauréat.command';
import {
  registerPuissanceQueries,
  registerPuissanceUseCases,
} from './puissance/puissance.register';

export type LauréatQueryDependencies = AbandonQueryDependencies &
  CahierDesChargesChoisiQueryDependencies &
  GarantiesFinancièresQueryDependencies &
  AchèvementQueryDependencies &
  ReprésentantLégalQueryDependencies &
  ActionnaireQueryDependencies &
  RaccordementQueryDependencies;

export type LauréatCommandDependencies = AbandonCommandDependencies &
  GarantiesFinancièresCommandDependencies &
  AchèvementCommandDependencies &
  ReprésentantLégalCommandDependencies &
  ActionnaireCommandDependencies &
  RaccordementCommandDependencies;

export const registerLauréatUseCases = (dependencies: LauréatCommandDependencies) => {
  // Commands
  registerNotifierLauréatCommand(dependencies.loadAggregate);
  registerModifierLauréatCommand(dependencies.loadAggregate);

  // Use cases
  registerAbandonUseCases(dependencies);
  registerGarantiesFinancièresUseCases(dependencies);
  registerAchèvementUseCases(dependencies);
  registerNotifierLauréatUseCase();
  registerModifierLauréatUseCase();
  registerReprésentantLégalUseCases(dependencies);
  registerActionnaireUseCases(dependencies);
  registerRaccordementUseCases(dependencies);
  registerPuissanceUseCases(dependencies);
};

export const registerLauréatQueries = (dependencies: LauréatQueryDependencies) => {
  registerAbandonQueries(dependencies);
  registerCahierDesChargesChoisiQueries(dependencies);
  registerGarantiesFinancièresQueries(dependencies);
  registerAchèvementQueries(dependencies);
  registerConsulterLauréatQuery(dependencies);
  registerReprésentantLégalQueries(dependencies);
  registerActionnaireQueries(dependencies);
  registerRaccordementQueries(dependencies);
  registerPuissanceQueries(dependencies);
};
