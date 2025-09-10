import { GetProjetAggregateRoot } from '..';

import { registerChoisirCahierDesChargesCommand } from './cahierDesCharges/choisir/choisirCahierDesCharges.command';
import { registerChoisirCahierDesChargesUseCase } from './cahierDesCharges/choisir/choisirCahierDesCharges.usecase';
import {
  ConsulterCahierDesChargesDependencies,
  registerConsulterCahierDesChargesQuery,
} from './cahierDesCharges/consulter/consulterCahierDesCharges.query';
import {
  ConsulterLauréatDependencies,
  registerConsulterLauréatQuery,
} from './consulter/consulterLauréat.query';
import { registerModifierLauréatCommand } from './modifier/modifierLauréat.command';
import { registerModifierLauréatUseCase } from './modifier/modifierLauréat.usecase';
import { registerNotifierLauréatCommand } from './notifier/notifierLauréat.command';
import { registerNotifierLauréatUseCase } from './notifier/notifierLauréat.usecase';
import { DélaiQueryDependencies, registerDélaiQueries, registerDélaiUseCases } from './délai';
import { registerProducteurUseCases, registerProducteurQueries } from './producteur';
import { ProducteurQueryDependencies } from './producteur/producteur.register';
import {
  AchèvementQueryDependencies,
  registerAchèvementQueries,
  registerAchèvementUseCases,
} from './achèvement/achèvement.register';
import {
  PuissanceQueryDependencies,
  registerPuissanceQueries,
  registerPuissanceUseCases,
} from './puissance/puissance.register';
import {
  AbandonQueryDependencies,
  registerAbandonQueries,
  registerAbandonUseCases,
} from './abandon/abandon.register';
import {
  FournisseurQueryDependencies,
  registerFournisseurQueries,
  registerFournisseurUseCases,
} from './fournisseur/fournisseur.register';
import {
  ActionnaireQueryDependencies,
  registerActionnaireQueries,
  registerActionnaireUseCases,
} from './actionnaire/actionnaire.register';
import {
  registerReprésentantLégalQueries,
  registerReprésentantLégalUseCases,
  ReprésentantLégalCommandDependencies,
  ReprésentantLégalQueryDependencies,
} from './représentantLégal/représentantLégal.register';
import {
  RaccordementQueryDependencies,
  registerRaccordementQueries,
  registerRaccordementUseCases,
} from './raccordement/raccordement.register';
import {
  ListerHistoriqueProjetDependencies,
  registerListerHistoriqueProjetQuery,
} from './historique/lister/listerHistoriqueProjet.query';
import { registerTâchePlanifiéeQuery, registerTâchePlanifiéeUseCases } from './tâche-planifiée';
import {
  GarantiesFinancièresQueryDependencies,
  registerGarantiesFinancièresQueries,
  registerGarantiesFinancièresUseCases,
} from './garanties-financières/garantiesFinancières.register';
import { registerInstallateurQueries } from './installateur';
import { InstallateurQueryDependencies } from './installateur/installateur.register';
import { registerTâcheQuery, TâcheQueryDependencies } from './tâche';

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
  AchèvementQueryDependencies &
  InstallateurQueryDependencies &
  TâcheQueryDependencies;

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
  registerInstallateurQueries(dependencies);
  registerTâcheQuery(dependencies);
};
