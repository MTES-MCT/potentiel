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
import {
  registerAchèvementQueries,
  registerAchèvementUseCases,
} from './achèvement/achèvement.register';
import {
  PuissanceQueryDependencies,
  registerPuissanceQueries,
  registerPuissanceUseCases,
} from './puissance/puissance.register';

export type LauréatQueryDependencies = ConsulterLauréatDependencies &
  ConsulterCahierDesChargesChoisiDependencies &
  DélaiQueryDependencies &
  ProducteurQueryDependencies &
  PuissanceQueryDependencies;

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
  registerAchèvementUseCases(dependencies);
  registerPuissanceUseCases(dependencies);
};

export const registerLauréatQueries = (dependencies: LauréatQueryDependencies) => {
  registerConsulterLauréatQuery(dependencies);
  registerConsulterCahierDesChargesChoisiQuery(dependencies);

  registerDélaiQueries(dependencies);
  registerProducteurQueries(dependencies);
  registerAchèvementQueries(dependencies);
  registerPuissanceQueries(dependencies);
};
