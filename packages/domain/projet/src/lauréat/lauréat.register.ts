import { GetProjetAggregateRoot } from '..';

import { registerChoisirCahierDesChargesCommand } from './choisir/choisirCahierDesCharges.command';
import { registerChoisirCahierDesChargesUseCase } from './choisir/choisirCahierDesCharges.usecase';
import {
  ConsulterCahierDesChargesChoisiDependencies,
  registerConsulterCahierDesChargesChoisiQuery,
} from './consulter/consulterCahierDesChargesChoisi.query';
import {
  ConsulterLauréatDependencies,
  registerConsulterLauréatQuery,
} from './consulter/consulterLauréat.query';
import { registerModifierLauréatCommand } from './modifier/modifierLauréat.command';
import { registerModifierLauréatUseCase } from './modifier/modifierLauréat.usecase';
import { registerNotifierLauréatCommand } from './notifier/notifierLauréat.command';
import { registerNotifierLauréatUseCase } from './notifier/notifierLauréat.usecase';
import { DélaiQueryDependencies, registerDélaiQueries } from './délai';
import { registerProducteurUseCases, registerProducteurQueries } from './producteur';
import {
  ProducteurCommandDependencies,
  ProducteurQueryDependencies,
} from './producteur/producteur.register';
import { registerGarantiesFinancièresUseCases } from './garanties-financières/garantiesFinancières.register';

export type LauréatQueryDependencies = ConsulterLauréatDependencies &
  ConsulterCahierDesChargesChoisiDependencies &
  DélaiQueryDependencies &
  ProducteurQueryDependencies;

export type LauréatCommandDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
} & ProducteurCommandDependencies;

export const registerLauréatUseCases = (dependencies: LauréatCommandDependencies) => {
  registerNotifierLauréatCommand(dependencies.getProjetAggregateRoot);
  registerNotifierLauréatUseCase();

  registerModifierLauréatCommand(dependencies.getProjetAggregateRoot);
  registerModifierLauréatUseCase();

  registerChoisirCahierDesChargesUseCase();
  registerChoisirCahierDesChargesCommand(dependencies.getProjetAggregateRoot);

  registerProducteurUseCases(dependencies);
  registerGarantiesFinancièresUseCases(dependencies);
};

export const registerLauréatQueries = (dependencies: LauréatQueryDependencies) => {
  registerConsulterLauréatQuery(dependencies);
  registerConsulterCahierDesChargesChoisiQuery(dependencies);

  registerDélaiQueries(dependencies);
  registerProducteurQueries(dependencies);
};
