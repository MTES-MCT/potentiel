import type {
  ConsulterChangementFournisseurQuery,
  ConsulterChangementFournisseurReadModel,
} from './changement/consulter/consulterChangementFournisseur.query.js';
import type {
  ListerChangementFournisseurQuery,
  ListerChangementFournisseurReadModel,
} from './changement/lister/listerChangementFournisseur.query.js';
import type { MettreÀJourFournisseurUseCase } from './changement/miseAJour/common/mettreÀJourFournisseur.usecase.js';
import type {
  ConsulterFournisseurQuery,
  ConsulterFournisseurReadModel,
} from './consulter/consulterFournisseur.query.js';
import type {
  HistoriqueFournisseurProjetListItemReadModel,
  ListerHistoriqueFournisseurProjetQuery,
  ListerHistoriqueFournisseurProjetReadModel,
} from './listerHistorique/listerHistoriqueFournisseurProjet.query.js';
import type { ModifierÉvaluationCarboneUseCase } from './modifier/modifierÉvaluationCarbone.usecase.js';

// Query
export type FournisseurQuery =
  | ConsulterFournisseurQuery
  | ConsulterChangementFournisseurQuery
  | ListerChangementFournisseurQuery
  | ListerHistoriqueFournisseurProjetQuery;

// ReadModel
export type {
  ConsulterChangementFournisseurQuery,
  ConsulterChangementFournisseurReadModel,
  ConsulterFournisseurQuery,
  ConsulterFournisseurReadModel,
  HistoriqueFournisseurProjetListItemReadModel,
  ListerChangementFournisseurQuery,
  ListerChangementFournisseurReadModel,
  ListerHistoriqueFournisseurProjetQuery,
  ListerHistoriqueFournisseurProjetReadModel,
};

// UseCases
export type FournisseurUseCase = ModifierÉvaluationCarboneUseCase | MettreÀJourFournisseurUseCase;

export type * from './changement/changementFournisseur.entity.js';
export type { ChangementFournisseurEnregistréEvent } from './changement/miseAJour/enregistrerChangement.event.js';
export type { FournisseurModifiéEvent } from './changement/miseAJour/modifierFournisseur.event.js';
export * as DocumentFournisseur from './documentFournisseur.valueType.js';
// Entities
export type * from './fournisseur.entity.js';
// Event
export type { FournisseurEvent } from './fournisseur.event.js';
// Register
export { registerFournisseurQueries } from './fournisseur.register.js';
export * as Fournisseur from './fournisseur.valueType.js';
export type { FournisseurImportéEvent } from './importer/importerFournisseur.event.js';
export type { ÉvaluationCarboneModifiéeEvent } from './modifier/modifierÉvaluationCarbone.event.js';
export * as NoteÉvaluationCarbone from './noteÉvaluationCarbone.valueType.js';
// ValueTypes
export * as TypeFournisseur from './typeFournisseur.valueType.js';
export type { MettreÀJourFournisseurUseCase, ModifierÉvaluationCarboneUseCase };
