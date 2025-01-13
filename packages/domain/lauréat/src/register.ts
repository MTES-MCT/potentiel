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

export type LauréatQueryDependencies = AbandonQueryDependencies &
  CahierDesChargesChoisiQueryDependencies &
  GarantiesFinancièresQueryDependencies &
  AchèvementQueryDependencies &
  ReprésentantLégalQueryDependencies &
  ActionnaireQueryDependencies;

export type LauréatCommandDependencies = AbandonCommandDependencies &
  GarantiesFinancièresCommandDependencies &
  AchèvementCommandDependencies &
  ReprésentantLégalCommandDependencies &
  ActionnaireCommandDependencies;

export const registerLauréatUseCases = (dependencies: LauréatCommandDependencies) => {
  // Commands
  registerNotifierLauréatCommand(dependencies.loadAggregate);

  // Use cases
  registerAbandonUseCases({ loadAggregate: dependencies.loadAggregate });
  registerGarantiesFinancièresUseCases({ loadAggregate: dependencies.loadAggregate });
  registerAchèvementUseCases({ loadAggregate: dependencies.loadAggregate });
  registerNotifierLauréatUseCase();
  registerReprésentantLégalUseCases({ loadAggregate: dependencies.loadAggregate });
  registerActionnaireUseCases(dependencies);
};

export const registerLauréatQueries = (dependencies: LauréatQueryDependencies) => {
  registerAbandonQueries(dependencies);
  registerCahierDesChargesChoisiQueries(dependencies);
  registerGarantiesFinancièresQueries(dependencies);
  registerAchèvementQueries(dependencies);
  registerConsulterLauréatQuery(dependencies);
  registerReprésentantLégalQueries(dependencies);
  registerActionnaireQueries(dependencies);
};
