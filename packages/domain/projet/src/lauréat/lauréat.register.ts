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
import { registerModifierSiteDeProductionCommand } from './modifier/modifierSiteDeProduction.command';
import { registerModifierSiteDeProductionUseCase } from './modifier/modifierSiteDeProduction.usecase';
import { registerModifierNomProjetCommand } from './modifier/modifierNomProjet.command';
import { registerModifierNomProjetUseCase } from './modifier/modifierNomProjet.usecase';
import { registerNotifierLauréatCommand } from './notifier/notifierLauréat.command';
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
import { registerTâcheQuery, TâcheQueryDependencies } from './tâche';
import {
  NatureDeLExploitationQueryDependencies,
  registerNatureDeLExploitationQueries,
  registerNatureDeLExploitationUseCases,
} from './nature-de-l-exploitation/natureDeLExploitation.register';
import {
  ListerLauréatDependencies,
  registerListerLauréatQuery,
} from './lister/listerLauréat.query';
import {
  InstallationQueryDependencies,
  registerInstallationQueries,
  registerInstallationUseCases,
} from './installation/installation.register';

export type LauréatQueryDependencies = ConsulterLauréatDependencies &
  ListerLauréatDependencies &
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
  InstallationQueryDependencies &
  TâcheQueryDependencies &
  NatureDeLExploitationQueryDependencies;

export type LauréatCommandDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
} & ReprésentantLégalCommandDependencies;

export const registerLauréatUseCases = (dependencies: LauréatCommandDependencies) => {
  registerNotifierLauréatCommand(dependencies.getProjetAggregateRoot);

  registerModifierSiteDeProductionCommand(dependencies.getProjetAggregateRoot);
  registerModifierSiteDeProductionUseCase();
  registerModifierNomProjetCommand(dependencies.getProjetAggregateRoot);
  registerModifierNomProjetUseCase();

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
  registerInstallationUseCases(dependencies);
  registerNatureDeLExploitationUseCases(dependencies);
};

export const registerLauréatQueries = (dependencies: LauréatQueryDependencies) => {
  registerConsulterLauréatQuery(dependencies);
  registerListerLauréatQuery(dependencies);
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
  registerInstallationQueries(dependencies);
  registerTâcheQuery(dependencies);
  registerNatureDeLExploitationQueries(dependencies);
};
