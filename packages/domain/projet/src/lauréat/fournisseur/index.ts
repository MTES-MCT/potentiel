import {
  ConsulterFournisseurQuery,
  ConsulterFournisseurReadModel,
} from './consulter/consulterFournisseur.query';
import { ModifierÉvaluationCarboneUseCase } from './modifier/modifierÉvaluationCarbone.usecase';
import { ConsulterChangementFournisseurQuery } from './changement/consulter/consulterChangementFournisseur.query';

// Query
export type FournisseurQuery = ConsulterFournisseurQuery | ConsulterChangementFournisseurQuery;
export type { ConsulterFournisseurQuery, ConsulterChangementFournisseurQuery };

// ReadModel
export { ConsulterFournisseurReadModel };

// UseCases
export type FournisseurUseCase = ModifierÉvaluationCarboneUseCase;
export { ModifierÉvaluationCarboneUseCase };

// Event
export { FournisseurEvent } from './fournisseur.event';
export { FournisseurImportéEvent } from './importer/importerFournisseur.event';
export { ÉvaluationCarboneModifiéeEvent } from './modifier/modifierÉvaluationCarbone.event';

// Register
export { registerFournisseurQueries } from './fournisseur.register';

// ValueTypes
export * as TypeFournisseur from './typeFournisseur.valueType';
export * as TypeDocumentFournisseur from './typeDocumentFournisseur.valueType';

// Entities
export * from './fournisseur.entity';
export * from './changement/changementFournisseur.entity';
