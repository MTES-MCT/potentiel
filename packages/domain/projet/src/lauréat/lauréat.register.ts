import { GetProjetAggregateRoot } from '../getProjetAggregateRoot.port.js';

import { registerChoisirCahierDesChargesCommand } from './cahierDesCharges/choisir/choisirCahierDesCharges.command.js';
import { registerChoisirCahierDesChargesUseCase } from './cahierDesCharges/choisir/choisirCahierDesCharges.usecase.js';
import {
  ConsulterCahierDesChargesDependencies,
  registerConsulterCahierDesChargesQuery,
} from './cahierDesCharges/consulter/consulterCahierDesCharges.query.js';
import {
  ConsulterLauréatDependencies,
  registerConsulterLauréatQuery,
} from './consulter/consulterLauréat.query.js';
import { registerModifierSiteDeProductionCommand } from './site-de-production/modifierSiteDeProduction.command.js';
import { registerModifierSiteDeProductionUseCase } from './site-de-production/modifierSiteDeProduction.usecase.js';
import { registerNotifierLauréatCommand } from './notifier/notifierLauréat.command.js';
import {
  DélaiQueryDependencies,
  registerDélaiQueries,
  registerDélaiUseCases,
} from './délai/index.js';
import { registerProducteurUseCases, registerProducteurQueries } from './producteur/index.js';
import { ProducteurQueryDependencies } from './producteur/producteur.register.js';
import {
  AchèvementQueryDependencies,
  registerAchèvementQueries,
  registerAchèvementUseCases,
} from './achèvement/achèvement.register.js';
import {
  PuissanceQueryDependencies,
  registerPuissanceQueries,
  registerPuissanceUseCases,
} from './puissance/puissance.register.js';
import {
  AbandonQueryDependencies,
  registerAbandonQueries,
  registerAbandonUseCases,
} from './abandon/abandon.register.js';
import {
  FournisseurQueryDependencies,
  registerFournisseurQueries,
  registerFournisseurUseCases,
} from './fournisseur/fournisseur.register.js';
import {
  ActionnaireQueryDependencies,
  registerActionnaireQueries,
  registerActionnaireUseCases,
} from './actionnaire/actionnaire.register.js';
import {
  registerReprésentantLégalQueries,
  registerReprésentantLégalUseCases,
  ReprésentantLégalCommandDependencies,
  ReprésentantLégalQueryDependencies,
} from './représentantLégal/représentantLégal.register.js';
import {
  RaccordementQueryDependencies,
  registerRaccordementQueries,
  registerRaccordementUseCases,
} from './raccordement/raccordement.register.js';
import {
  ListerHistoriqueProjetDependencies,
  registerListerHistoriqueProjetQuery,
} from './historique/lister/listerHistoriqueProjet.query.js';
import {
  registerTâchePlanifiéeQuery,
  registerTâchePlanifiéeUseCases,
} from './tâche-planifiée/index.js';
import {
  GarantiesFinancièresQueryDependencies,
  registerGarantiesFinancièresQueries,
  registerGarantiesFinancièresUseCases,
} from './garanties-financières/garantiesFinancières.register.js';
import { registerTâcheQuery, TâcheQueryDependencies } from './tâche/index.js';
import {
  NatureDeLExploitationQueryDependencies,
  registerNatureDeLExploitationQueries,
  registerNatureDeLExploitationUseCases,
} from './nature-de-l-exploitation/natureDeLExploitation.register.js';
import {
  ListerLauréatDependencies,
  registerListerLauréatQuery,
} from './lister/listerLauréat.query.js';
import {
  InstallationQueryDependencies,
  registerInstallationQueries,
  registerInstallationUseCases,
} from './installation/installation.register.js';
import { registerEnregistrerChangementNomProjetCommand } from './nomProjet/changement/enregistrerChangementNomProjet/enregistrerChangementNomProjet.command.js';
import { registerEnregistrerChangementNomProjetUseCase } from './nomProjet/changement/enregistrerChangementNomProjet/enregistrerChangementNomProjet.usecase.js';
import { registerConsulterChangementNomProjetQuery } from './nomProjet/changement/consulter/consulterChangementNomProjet.js';
import { registerListerChangementNomProjetQuery } from './nomProjet/changement/lister/listerChangementNomProjet.js';
import { registerModifierNomProjetCommand } from './nomProjet/modifier/modifierNomProjet.command.js';
import { registerModifierNomProjetUseCase } from './nomProjet/modifier/modifierNomProjet.usecase.js';
import {
  ListerHistoriqueLauréatDependencies,
  registerListerHistoriqueLauréatQuery,
} from './listerHistorique/listerHistoriqueLauréat.query.js';
import {
  ListerLauréatEnrichiDependencies,
  registerListerLauréatEnrichiQuery,
} from './lister/listerLauréatEnrichi.query.js';

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
  NatureDeLExploitationQueryDependencies &
  ListerHistoriqueLauréatDependencies &
  ListerLauréatEnrichiDependencies;

export type LauréatCommandDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
} & ReprésentantLégalCommandDependencies;

export const registerLauréatUseCases = (dependencies: LauréatCommandDependencies) => {
  registerNotifierLauréatCommand(dependencies.getProjetAggregateRoot);

  registerModifierSiteDeProductionCommand(dependencies.getProjetAggregateRoot);
  registerModifierSiteDeProductionUseCase();
  registerModifierNomProjetCommand(dependencies.getProjetAggregateRoot);
  registerModifierNomProjetUseCase();
  registerEnregistrerChangementNomProjetCommand(dependencies.getProjetAggregateRoot);
  registerEnregistrerChangementNomProjetUseCase();

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
  registerConsulterChangementNomProjetQuery(dependencies);
  registerListerChangementNomProjetQuery(dependencies);
  registerListerHistoriqueLauréatQuery(dependencies);
  registerListerLauréatEnrichiQuery(dependencies);

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
