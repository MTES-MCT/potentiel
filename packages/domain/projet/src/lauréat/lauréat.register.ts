import type { GetProjetAggregateRoot } from '..';
import {
  type AbandonQueryDependencies,
  registerAbandonQueries,
  registerAbandonUseCases,
} from './abandon/abandon.register';
import {
  type AchèvementQueryDependencies,
  registerAchèvementQueries,
  registerAchèvementUseCases,
} from './achèvement/achèvement.register';
import {
  type ActionnaireQueryDependencies,
  registerActionnaireQueries,
  registerActionnaireUseCases,
} from './actionnaire/actionnaire.register';
import { registerChoisirCahierDesChargesCommand } from './cahierDesCharges/choisir/choisirCahierDesCharges.command';
import { registerChoisirCahierDesChargesUseCase } from './cahierDesCharges/choisir/choisirCahierDesCharges.usecase';
import {
  type ConsulterCahierDesChargesDependencies,
  registerConsulterCahierDesChargesQuery,
} from './cahierDesCharges/consulter/consulterCahierDesCharges.query';
import {
  type ConsulterLauréatDependencies,
  registerConsulterLauréatQuery,
} from './consulter/consulterLauréat.query';
import { type DélaiQueryDependencies, registerDélaiQueries, registerDélaiUseCases } from './délai';
import {
  type FournisseurQueryDependencies,
  registerFournisseurQueries,
  registerFournisseurUseCases,
} from './fournisseur/fournisseur.register';
import {
  type GarantiesFinancièresQueryDependencies,
  registerGarantiesFinancièresQueries,
  registerGarantiesFinancièresUseCases,
} from './garanties-financières/garantiesFinancières.register';
import {
  type ListerHistoriqueProjetDependencies,
  registerListerHistoriqueProjetQuery,
} from './historique/lister/listerHistoriqueProjet.query';
import { registerModifierLauréatCommand } from './modifier/modifierLauréat.command';
import { registerModifierLauréatUseCase } from './modifier/modifierLauréat.usecase';
import { registerNotifierLauréatCommand } from './notifier/notifierLauréat.command';
import { registerNotifierLauréatUseCase } from './notifier/notifierLauréat.usecase';
import { registerProducteurQueries, registerProducteurUseCases } from './producteur';
import type { ProducteurQueryDependencies } from './producteur/producteur.register';
import {
  type PuissanceQueryDependencies,
  registerPuissanceQueries,
  registerPuissanceUseCases,
} from './puissance/puissance.register';
import {
  type RaccordementQueryDependencies,
  registerRaccordementQueries,
  registerRaccordementUseCases,
} from './raccordement/raccordement.register';
import {
  type ReprésentantLégalCommandDependencies,
  type ReprésentantLégalQueryDependencies,
  registerReprésentantLégalQueries,
  registerReprésentantLégalUseCases,
} from './représentantLégal/représentantLégal.register';
import { registerTâchePlanifiéeQuery, registerTâchePlanifiéeUseCases } from './tâche-planifiée';

export type LauréatQueryDependencies = ConsulterLauréatDependencies &
  ConsulterCahierDesChargesDependencies &
  DélaiQueryDependencies &
  ProducteurQueryDependencies &
  PuissanceQueryDependencies &
  FournisseurQueryDependencies &
  AbandonQueryDependencies &
  ActionnaireQueryDependencies &
  ReprésentantLégalQueryDependencies &
  RaccordementQueryDependencies &
  ReprésentantLégalQueryDependencies &
  GarantiesFinancièresQueryDependencies &
  ListerHistoriqueProjetDependencies &
  AchèvementQueryDependencies;

export type LauréatCommandDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
} & ReprésentantLégalCommandDependencies;

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
  registerActionnaireUseCases(dependencies);
  registerReprésentantLégalUseCases(dependencies);
  registerAbandonUseCases(dependencies);
  registerFournisseurUseCases(dependencies);
  registerRaccordementUseCases(dependencies);
  registerDélaiUseCases(dependencies);
  registerTâchePlanifiéeUseCases(dependencies);
  registerGarantiesFinancièresUseCases(dependencies);
};

export const registerLauréatQueries = (dependencies: LauréatQueryDependencies) => {
  registerConsulterLauréatQuery(dependencies);
  registerConsulterCahierDesChargesQuery(dependencies);

  registerDélaiQueries(dependencies);
  registerProducteurQueries(dependencies);
  registerAchèvementQueries(dependencies);
  registerPuissanceQueries(dependencies);
  registerAbandonQueries(dependencies);
  registerFournisseurQueries(dependencies);
  registerActionnaireQueries(dependencies);
  registerReprésentantLégalQueries(dependencies);
  registerRaccordementQueries(dependencies);
  registerTâchePlanifiéeQuery(dependencies);
  registerGarantiesFinancièresQueries(dependencies);
  registerListerHistoriqueProjetQuery(dependencies);
};
