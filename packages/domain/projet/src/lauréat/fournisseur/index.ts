import {
  type ConsulterChangementFournisseurQuery,
  ConsulterChangementFournisseurReadModel,
} from './changement/consulter/consulterChangementFournisseur.query';
import { EnregistrerChangementFournisseurUseCase } from './changement/enregistrerChangement/enregistrerChangement.usecase';
import {
  type ListerChangementFournisseurQuery,
  ListerChangementFournisseurReadModel,
} from './changement/lister/listerChangementFournisseur.query';
import {
  type ConsulterFournisseurQuery,
  ConsulterFournisseurReadModel,
} from './consulter/consulterFournisseur.query';
import {
  HistoriqueFournisseurProjetListItemReadModel,
  type ListerHistoriqueFournisseurProjetQuery,
  ListerHistoriqueFournisseurProjetReadModel,
} from './listerHistorique/listerHistoriqueFournisseurProjet.query';
import { ModifierÉvaluationCarboneUseCase } from './modifier/modifierÉvaluationCarbone.usecase';

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
export {
  ConsulterFournisseurReadModel,
  ListerChangementFournisseurReadModel,
  ConsulterChangementFournisseurReadModel,
  ListerHistoriqueFournisseurProjetReadModel,
  HistoriqueFournisseurProjetListItemReadModel,
};

// UseCases
export type FournisseurUseCase =
  | ModifierÉvaluationCarboneUseCase
  | EnregistrerChangementFournisseurUseCase;
export { ModifierÉvaluationCarboneUseCase, EnregistrerChangementFournisseurUseCase };

export * from './changement/changementFournisseur.entity';
export { ChangementFournisseurEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangement.event';
// Entities
export * from './fournisseur.entity';
// Event
export { FournisseurEvent } from './fournisseur.event';
// Register
export { registerFournisseurQueries } from './fournisseur.register';
export * as Fournisseur from './fournisseur.valueType';
export { FournisseurImportéEvent } from './importer/importerFournisseur.event';
export { ÉvaluationCarboneModifiéeEvent } from './modifier/modifierÉvaluationCarbone.event';
export * as NoteÉvaluationCarbone from './noteÉvaluationCarbone.valueType';
export * as TypeDocumentFournisseur from './typeDocumentFournisseur.valueType';
// ValueTypes
export * as TypeFournisseur from './typeFournisseur.valueType';
