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
import { ModifierNomProjetUseCase } from './modifier/modifierNomProjet.usecase';
import { ListerLauréatQuery, ListerLauréatReadModel } from './lister/listerLauréat.query';

// Query
export type LauréatQuery =
  | ConsulterLauréatQuery
  | ListerLauréatQuery
  | ConsulterCahierDesChargesQuery
  | ListerHistoriqueProjetQuery;

export {
  ConsulterLauréatQuery,
  ListerLauréatQuery,
  ConsulterCahierDesChargesQuery,
  ListerHistoriqueProjetQuery,
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
};

// Port
export { ConsulterCahierDesChargesPort } from './cahierDesCharges/consulter/consulterCahierDesCharges.query';

// UseCases
export type LauréatUseCase =
  | ModifierSiteDeProductionUseCase
  | ModifierNomProjetUseCase
  | ChoisirCahierDesChargesUseCase;
export {
  ModifierSiteDeProductionUseCase,
  ModifierNomProjetUseCase,
  ChoisirCahierDesChargesUseCase,
};

// Events
export { LauréatEvent } from './lauréat.event';
export {
  LauréatNotifiéEvent,
  LauréatNotifiéV1Event,
  NomEtLocalitéLauréatImportésEvent,
} from './notifier/lauréatNotifié.event';
export { SiteDeProductionModifiéEvent } from './modifier/siteDeProductionModifié.event';
export { NomProjetModifiéEvent } from './modifier/nomProjetModifié.event';
export { CahierDesChargesChoisiEvent } from './cahierDesCharges/choisir/cahierDesChargesChoisi.event';

// Register
export { registerLauréatQueries, registerLauréatUseCases } from './lauréat.register';

// Entities
export { LauréatEntity } from './lauréat.entity';

// ValueType
export * as StatutLauréat from './statutLauréat.valueType';

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
export * as DispositifDeStockage from './dispositif-de-stockage';
export * as NatureDeLExploitation from './nature-de-l-exploitation';
