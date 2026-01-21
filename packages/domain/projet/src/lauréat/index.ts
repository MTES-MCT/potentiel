import { ChoisirCahierDesChargesUseCase } from './cahierDesCharges/choisir/choisirCahierDesCharges.usecase';
import {
  ConsulterCahierDesChargesQuery,
  ConsulterCahierDesChargesReadModel,
} from './cahierDesCharges/consulter/consulterCahierDesCharges.query';
import {
  ConsulterLauréatQuery,
  ConsulterLauréatReadModel,
} from './consulter/consulterLauréat.query';
import {
  ListerHistoriqueProjetQuery,
  ListerHistoriqueProjetReadModel,
  HistoriqueListItemReadModels,
  HistoriqueLauréatProjetListItemReadModel,
  HistoriqueAchèvementProjetListItemReadModel,
  HistoriqueGarantiesFinancièresProjetListItemReadModel,
} from './historique/lister/listerHistoriqueProjet.query';
import { ModifierSiteDeProductionUseCase } from './modifier/modifierSiteDeProduction.usecase';
import { ListerLauréatQuery, ListerLauréatReadModel } from './lister/listerLauréat.query';
import { EnregistrerChangementNomProjetUseCase } from './nomProjet/changement/enregistrerChangementNomProjet/enregistrerChangementNomProjet.usecase';
import {
  ConsulterChangementNomProjetQuery,
  ConsulterChangementNomProjetReadModel,
} from './nomProjet/changement/consulter/consulterChangementNomProjet';
import {
  ListerChangementNomProjetQuery,
  ListerChangementNomProjetReadModel,
} from './nomProjet/changement/lister/listerChangementNomProjet';
import { ModifierNomProjetUseCase } from './nomProjet/modifier/modifierNomProjet.usecase';
import {
  ListerHistoriqueLauréatQuery,
  ListerHistoriqueLauréatReadModel,
} from './listerHistorique/listerHistoriqueLauréat.query';
import {
  ListerLauréatEnrichiQuery,
  ListerLauréatEnrichiReadModel,
} from './lister/listerLauréatEnrichi.query';

// Query
export type LauréatQuery =
  | ConsulterLauréatQuery
  | ListerLauréatQuery
  | ConsulterCahierDesChargesQuery
  | ListerHistoriqueProjetQuery
  | ConsulterChangementNomProjetQuery
  | ListerChangementNomProjetQuery
  | ListerHistoriqueLauréatQuery
  | ListerLauréatEnrichiQuery;

export {
  ConsulterLauréatQuery,
  ListerLauréatQuery,
  ConsulterCahierDesChargesQuery,
  ListerHistoriqueProjetQuery,
  ConsulterChangementNomProjetQuery,
  ListerChangementNomProjetQuery,
  ListerHistoriqueLauréatQuery,
  ListerLauréatEnrichiQuery,
};

// ReadModel
export {
  ConsulterLauréatReadModel,
  ListerLauréatReadModel,
  ConsulterCahierDesChargesReadModel,
  ListerHistoriqueProjetReadModel,
  HistoriqueListItemReadModels,
  HistoriqueLauréatProjetListItemReadModel,
  HistoriqueGarantiesFinancièresProjetListItemReadModel,
  HistoriqueAchèvementProjetListItemReadModel,
  ConsulterChangementNomProjetReadModel,
  ListerChangementNomProjetReadModel,
  ListerHistoriqueLauréatReadModel,
  ListerLauréatEnrichiReadModel,
};

// Port
export { ConsulterCahierDesChargesPort } from './cahierDesCharges/consulter/consulterCahierDesCharges.query';

// UseCases
export type LauréatUseCase =
  | ModifierSiteDeProductionUseCase
  | ModifierNomProjetUseCase
  | ChoisirCahierDesChargesUseCase
  | EnregistrerChangementNomProjetUseCase;
export {
  ModifierSiteDeProductionUseCase,
  ModifierNomProjetUseCase,
  ChoisirCahierDesChargesUseCase,
  EnregistrerChangementNomProjetUseCase,
};

// Events
export { LauréatEvent } from './lauréat.event';
export {
  LauréatNotifiéEvent,
  LauréatNotifiéV1Event,
  NomEtLocalitéLauréatImportésEvent,
} from './notifier/lauréatNotifié.event';
export { SiteDeProductionModifiéEvent } from './modifier/siteDeProductionModifié.event';
export { NomProjetModifiéEvent } from './nomProjet/modifier/nomProjetModifié.event';
export { CahierDesChargesChoisiEvent } from './cahierDesCharges/choisir/cahierDesChargesChoisi.event';
export { ChangementNomProjetEnregistréEvent } from './nomProjet/changement/enregistrerChangementNomProjet/enregistrerChangementNomProjet.event';

// Register
export { registerLauréatQueries, registerLauréatUseCases } from './lauréat.register';

// Entities
export { LauréatEntity } from './lauréat.entity';
export { ChangementNomProjetEntity } from './nomProjet/changement/changementNomProjet.entity';

// ValueType
export * as StatutLauréat from './statutLauréat.valueType';
export * as TypeDocumentNomProjet from './nomProjet/changement/TypeDocumentNomProjet.valueType';
export * as TypeDocumentSiteDeProduction from './typeDocumentModificationSiteDeProduction.valueType';

export * as Abandon from './abandon';
export * as Actionnaire from './actionnaire';
export * as Achèvement from './achèvement';
export * as Délai from './délai';
export * as GarantiesFinancières from './garanties-financières';
export * as Producteur from './producteur';
export * as Puissance from './puissance';
export * as Fournisseur from './fournisseur';
export * as ReprésentantLégal from './représentantLégal';
export * as Raccordement from './raccordement';
export * as TâchePlanifiée from './tâche-planifiée';
export * as Tâche from './tâche';
export * as Installation from './installation';
export * as NatureDeLExploitation from './nature-de-l-exploitation';
