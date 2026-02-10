import {
  ConsulterFournisseurQuery,
  ConsulterFournisseurReadModel,
} from './consulter/consulterFournisseur.query.js';
import { ModifierÉvaluationCarboneUseCase } from './modifier/modifierÉvaluationCarbone.usecase.js';
import {
  ConsulterChangementFournisseurQuery,
  ConsulterChangementFournisseurReadModel,
} from './changement/consulter/consulterChangementFournisseur.query.js';
import {
  ListerChangementFournisseurQuery,
  ListerChangementFournisseurReadModel,
} from './changement/lister/listerChangementFournisseur.query.js';
import {
  ListerHistoriqueFournisseurProjetQuery,
  ListerHistoriqueFournisseurProjetReadModel,
  HistoriqueFournisseurProjetListItemReadModel,
} from './listerHistorique/listerHistoriqueFournisseurProjet.query.js';
import { MettreÀJourFournisseurUseCase } from './changement/miseAJour/common/mettreÀJourFournisseur.usecase.js';

// Query
export type FournisseurQuery =
  | ConsulterFournisseurQuery
  | ConsulterChangementFournisseurQuery
  | ListerChangementFournisseurQuery
  | ListerHistoriqueFournisseurProjetQuery;
export type {
  ConsulterFournisseurQuery,
  ConsulterChangementFournisseurQuery,
  ListerChangementFournisseurQuery,
  ListerHistoriqueFournisseurProjetQuery,
};

// ReadModel
export type {
  ConsulterFournisseurReadModel,
  ListerChangementFournisseurReadModel,
  ConsulterChangementFournisseurReadModel,
  ListerHistoriqueFournisseurProjetReadModel,
  HistoriqueFournisseurProjetListItemReadModel,
};

// UseCases
export type FournisseurUseCase = ModifierÉvaluationCarboneUseCase | MettreÀJourFournisseurUseCase;
export type { ModifierÉvaluationCarboneUseCase, MettreÀJourFournisseurUseCase };

// Event
export type { FournisseurEvent } from './fournisseur.event.js';
export type { FournisseurImportéEvent } from './importer/importerFournisseur.event.js';
export type { ÉvaluationCarboneModifiéeEvent } from './modifier/modifierÉvaluationCarbone.event.js';
export type { ChangementFournisseurEnregistréEvent } from './changement/miseAJour/enregistrerChangement.event.js';
export type { FournisseurModifiéEvent } from './changement/miseAJour/modifierFournisseur.event.js';

// Register
export { registerFournisseurQueries } from './fournisseur.register.js';

// ValueTypes
export * as TypeFournisseur from './typeFournisseur.valueType.js';
export * as Fournisseur from './fournisseur.valueType.js';
export * as TypeDocumentFournisseur from './typeDocumentFournisseur.valueType.js';
export * as NoteÉvaluationCarbone from './noteÉvaluationCarbone.valueType.js';

// Entities
export type * from './fournisseur.entity.js';
export type * from './changement/changementFournisseur.entity.js';
