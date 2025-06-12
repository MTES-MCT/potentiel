import {
  ConsulterFournisseurQuery,
  ConsulterFournisseurReadModel,
} from './consulter/consulterFournisseur.query';
import { ModifierÉvaluationCarboneUseCase } from './modifier/modifierÉvaluationCarbone.usecase';
import {
  ConsulterChangementFournisseurQuery,
  ConsulterChangementFournisseurReadModel,
} from './changement/consulter/consulterChangementFournisseur.query';
import { EnregistrerChangementFournisseurUseCase } from './changement/enregistrerChangement/enregistrerChangement.usecase';
import {
  ListerChangementFournisseurQuery,
  ListerChangementFournisseurReadModel,
} from './lister/listerChangementFournisseur.query';

// Query
export type FournisseurQuery =
  | ConsulterFournisseurQuery
  | ConsulterChangementFournisseurQuery
  | ListerChangementFournisseurQuery;
export type {
  ConsulterFournisseurQuery,
  ConsulterChangementFournisseurQuery,
  ListerChangementFournisseurQuery,
};

// ReadModel
export {
  ConsulterFournisseurReadModel,
  ListerChangementFournisseurReadModel,
  ConsulterChangementFournisseurReadModel,
};

// UseCases
export type FournisseurUseCase =
  | ModifierÉvaluationCarboneUseCase
  | EnregistrerChangementFournisseurUseCase;
export { ModifierÉvaluationCarboneUseCase, EnregistrerChangementFournisseurUseCase };

// Event
export { FournisseurEvent } from './fournisseur.event';
export { FournisseurImportéEvent } from './importer/importerFournisseur.event';
export { ÉvaluationCarboneModifiéeEvent } from './modifier/modifierÉvaluationCarbone.event';
export { ChangementFournisseurEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangement.event';

// Register
export { registerFournisseurQueries } from './fournisseur.register';

// ValueTypes
export * as TypeFournisseur from './typeFournisseur.valueType';
export * as TypeDocumentFournisseur from './typeDocumentFournisseur.valueType';
export * as NoteÉvaluationCarbone from './noteÉvaluationCarbone.valueType';

// Entities
export * from './fournisseur.entity';
export * from './changement/changementFournisseur.entity';
