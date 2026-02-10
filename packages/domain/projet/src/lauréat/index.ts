import { ChoisirCahierDesChargesUseCase } from './cahierDesCharges/choisir/choisirCahierDesCharges.usecase.js';
import {
  ConsulterCahierDesChargesQuery,
  ConsulterCahierDesChargesReadModel,
} from './cahierDesCharges/consulter/consulterCahierDesCharges.query.js';
import {
  ConsulterLauréatQuery,
  ConsulterLauréatReadModel,
} from './consulter/consulterLauréat.query.js';
import {
  ListerHistoriqueProjetQuery,
  ListerHistoriqueProjetReadModel,
  HistoriqueListItemReadModels,
  HistoriqueLauréatProjetListItemReadModel,
  HistoriqueAchèvementProjetListItemReadModel,
  HistoriqueGarantiesFinancièresProjetListItemReadModel,
} from './historique/lister/listerHistoriqueProjet.query.js';
import { ModifierSiteDeProductionUseCase } from './site-de-production/modifierSiteDeProduction.usecase.js';
import { ListerLauréatQuery, ListerLauréatReadModel } from './lister/listerLauréat.query.js';
import { EnregistrerChangementNomProjetUseCase } from './nomProjet/changement/enregistrerChangementNomProjet/enregistrerChangementNomProjet.usecase.js';
import {
  ConsulterChangementNomProjetQuery,
  ConsulterChangementNomProjetReadModel,
} from './nomProjet/changement/consulter/consulterChangementNomProjet.js';
import {
  ListerChangementNomProjetQuery,
  ListerChangementNomProjetReadModel,
} from './nomProjet/changement/lister/listerChangementNomProjet.js';
import { ModifierNomProjetUseCase } from './nomProjet/modifier/modifierNomProjet.usecase.js';
import {
  ListerHistoriqueLauréatQuery,
  ListerHistoriqueLauréatReadModel,
} from './listerHistorique/listerHistoriqueLauréat.query.js';
import {
  LauréatEnrichiListItemReadModel,
  ListerLauréatEnrichiQuery,
  ListerLauréatEnrichiReadModel,
} from './lister/listerLauréatEnrichi.query.js';

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

export type {
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
export type {
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
  LauréatEnrichiListItemReadModel,
};

// Port
export type { ConsulterCahierDesChargesPort } from './cahierDesCharges/consulter/consulterCahierDesCharges.query.js';

// UseCases
export type LauréatUseCase =
  | ModifierSiteDeProductionUseCase
  | ModifierNomProjetUseCase
  | ChoisirCahierDesChargesUseCase
  | EnregistrerChangementNomProjetUseCase;
export type {
  ModifierSiteDeProductionUseCase,
  ModifierNomProjetUseCase,
  ChoisirCahierDesChargesUseCase,
  EnregistrerChangementNomProjetUseCase,
};

// Events
export type { LauréatEvent } from './lauréat.event.js';
export type {
  LauréatNotifiéEvent,
  LauréatNotifiéV1Event,
  NomEtLocalitéLauréatImportésEvent,
} from './notifier/lauréatNotifié.event.js';
export type { SiteDeProductionModifiéEvent } from './site-de-production/siteDeProductionModifié.event.js';
export type { NomProjetModifiéEvent } from './nomProjet/modifier/nomProjetModifié.event.js';
export type { CahierDesChargesChoisiEvent } from './cahierDesCharges/choisir/cahierDesChargesChoisi.event.js';
export type { ChangementNomProjetEnregistréEvent } from './nomProjet/changement/enregistrerChangementNomProjet/enregistrerChangementNomProjet.event.js';
export type { StatutLauréatModifiéEvent } from './statut/statutModifié.event.js';

// Register
export { registerLauréatQueries, registerLauréatUseCases } from './lauréat.register.js';

// Entities
export type { LauréatEntity } from './lauréat.entity.js';
export type { ChangementNomProjetEntity } from './nomProjet/changement/changementNomProjet.entity.js';

// ValueType
export * as StatutLauréat from './statutLauréat.valueType.js';
export * as TypeDocumentNomProjet from './nomProjet/changement/TypeDocumentNomProjet.valueType.js';
export * as TypeDocumentSiteDeProduction from './typeDocumentModificationSiteDeProduction.valueType.js';

export * as Abandon from './abandon/index.js';
export * as Actionnaire from './actionnaire/index.js';
export * as Achèvement from './achèvement/index.js';
export * as Délai from './délai/index.js';
export * as GarantiesFinancières from './garanties-financières/index.js';
export * as Producteur from './producteur/index.js';
export * as Puissance from './puissance/index.js';
export * as Fournisseur from './fournisseur/index.js';
export * as ReprésentantLégal from './représentantLégal/index.js';
export * as Raccordement from './raccordement/index.js';
export * as TâchePlanifiée from './tâche-planifiée/index.js';
export * as Tâche from './tâche/index.js';
export * as Installation from './installation/index.js';
export * as NatureDeLExploitation from './nature-de-l-exploitation/index.js';
