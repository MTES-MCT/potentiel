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
import { EnregistrerChangementNomProjetUseCase } from './changement/nom-projet/enregistrerChangementNomProjet/enregistrerChangementNomProjet.usecase';
import {
  ConsulterChangementNomProjetQuery,
  ConsulterChangementNomProjetReadModel,
} from './changement/nom-projet/consulter/consulterChangementNomProjet';
import {
  ListerChangementNomProjetQuery,
  ListerChangementNomProjetReadModel,
} from './changement/nom-projet/lister/listerChangementNomProjet';

// Query
export type LauréatQuery =
  | ConsulterLauréatQuery
  | ListerLauréatQuery
  | ConsulterCahierDesChargesQuery
  | ListerHistoriqueProjetQuery
  | ConsulterChangementNomProjetQuery
  | ListerChangementNomProjetQuery;

export {
  ConsulterLauréatQuery,
  ListerLauréatQuery,
  ConsulterCahierDesChargesQuery,
  ListerHistoriqueProjetQuery,
  ConsulterChangementNomProjetQuery,
  ListerChangementNomProjetQuery,
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
export { NomProjetModifiéEvent } from './modifier/nomProjetModifié.event';
export { CahierDesChargesChoisiEvent } from './cahierDesCharges/choisir/cahierDesChargesChoisi.event';
export { ChangementNomProjetEnregistréEvent } from './changement/nom-projet/enregistrerChangementNomProjet/enregistrerChangementNomProjet.event';

// Register
export { registerLauréatQueries, registerLauréatUseCases } from './lauréat.register';

// Entities
export { LauréatEntity } from './lauréat.entity';
export { ChangementNomProjetEntity } from './changement/nom-projet/changementNomProjet.entity';

// ValueType
export * as StatutLauréat from './statutLauréat.valueType';
export * as TypeDocumentNomProjet from './changement/nom-projet/TypeDocumentNomProjet.valueType';

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
