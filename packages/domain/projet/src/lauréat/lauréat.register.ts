import type { GetProjetAggregateRoot } from '../getProjetAggregateRoot.port.js';
import {
  type AbandonQueryDependencies,
  registerAbandonQueries,
  registerAbandonUseCases,
} from './abandon/abandon.register.js';
import {
  type AchèvementQueryDependencies,
  registerAchèvementQueries,
  registerAchèvementUseCases,
} from './achèvement/achèvement.register.js';
import {
  type ActionnaireQueryDependencies,
  registerActionnaireQueries,
  registerActionnaireUseCases,
} from './actionnaire/actionnaire.register.js';
import { registerChoisirCahierDesChargesCommand } from './cahierDesCharges/choisir/choisirCahierDesCharges.command.js';
import { registerChoisirCahierDesChargesUseCase } from './cahierDesCharges/choisir/choisirCahierDesCharges.usecase.js';
import {
  type ConsulterCahierDesChargesDependencies,
  registerConsulterCahierDesChargesQuery,
} from './cahierDesCharges/consulter/consulterCahierDesCharges.query.js';
import {
  type ConsulterLauréatDependencies,
  registerConsulterLauréatQuery,
} from './consulter/consulterLauréat.query.js';
import {
  type DélaiQueryDependencies,
  registerDélaiQueries,
  registerDélaiUseCases,
} from './délai/index.js';
import {
  type FournisseurQueryDependencies,
  registerFournisseurQueries,
  registerFournisseurUseCases,
} from './fournisseur/fournisseur.register.js';
import {
  type GarantiesFinancièresQueryDependencies,
  registerGarantiesFinancièresQueries,
  registerGarantiesFinancièresUseCases,
} from './garanties-financières/garantiesFinancières.register.js';
import {
  type ListerHistoriqueProjetDependencies,
  registerListerHistoriqueProjetQuery,
} from './historique/lister/listerHistoriqueProjet.query.js';
import {
  type InstallationQueryDependencies,
  registerInstallationQueries,
  registerInstallationUseCases,
} from './installation/installation.register.js';
import {
  type ListerLauréatDependencies,
  registerListerLauréatQuery,
} from './lister/listerLauréat.query.js';
import {
  type ListerLauréatEnrichiDependencies,
  registerListerLauréatEnrichiQuery,
} from './lister/listerLauréatEnrichi.query.js';
import {
  type ListerHistoriqueLauréatDependencies,
  registerListerHistoriqueLauréatQuery,
} from './listerHistorique/listerHistoriqueLauréat.query.js';
import {
  type NatureDeLExploitationQueryDependencies,
  registerNatureDeLExploitationQueries,
  registerNatureDeLExploitationUseCases,
} from './nature-de-l-exploitation/natureDeLExploitation.register.js';
import { registerConsulterChangementNomProjetQuery } from './nom-projet/changement/consulter/consulterChangementNomProjet.js';
import { registerEnregistrerChangementNomProjetCommand } from './nom-projet/changement/enregistrerChangementNomProjet/enregistrerChangementNomProjet.command.js';
import { registerEnregistrerChangementNomProjetUseCase } from './nom-projet/changement/enregistrerChangementNomProjet/enregistrerChangementNomProjet.usecase.js';
import { registerListerChangementNomProjetQuery } from './nom-projet/changement/lister/listerChangementNomProjet.js';
import { registerModifierNomProjetCommand } from './nom-projet/modifier/modifierNomProjet.command.js';
import { registerModifierNomProjetUseCase } from './nom-projet/modifier/modifierNomProjet.usecase.js';
import { registerNotifierLauréatCommand } from './notifier/notifierLauréat.command.js';
import {
  type PowerPurchaseAgreementQueryDependencies,
  registerPowerPurchaseAgreementQueries,
  registerPowerPurchaseAgreementUseCases,
} from './power-purchase-agreement/PowerPurchaseAgreement.register.js';
import { registerProducteurQueries, registerProducteurUseCases } from './producteur/index.js';
import type { ProducteurQueryDependencies } from './producteur/producteur.register.js';
import {
  type PuissanceQueryDependencies,
  registerPuissanceQueries,
  registerPuissanceUseCases,
} from './puissance/puissance.register.js';
import {
  type RaccordementQueryDependencies,
  registerRaccordementQueries,
  registerRaccordementUseCases,
} from './raccordement/raccordement.register.js';
import {
  type ReprésentantLégalCommandDependencies,
  type ReprésentantLégalQueryDependencies,
  registerReprésentantLégalQueries,
  registerReprésentantLégalUseCases,
} from './représentantLégal/représentantLégal.register.js';
import { registerModifierSiteDeProductionCommand } from './site-de-production/modifierSiteDeProduction.command.js';
import { registerModifierSiteDeProductionUseCase } from './site-de-production/modifierSiteDeProduction.usecase.js';
import { registerTâcheQuery, type TâcheQueryDependencies } from './tâche/index.js';
import {
  registerTâchePlanifiéeQuery,
  registerTâchePlanifiéeUseCases,
} from './tâche-planifiée/index.js';

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
  ListerLauréatEnrichiDependencies &
  PowerPurchaseAgreementQueryDependencies;

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
  registerPowerPurchaseAgreementUseCases(dependencies);
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
  registerPowerPurchaseAgreementQueries(dependencies);
};
