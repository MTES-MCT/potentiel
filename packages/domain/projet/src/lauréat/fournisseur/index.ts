import { ConsulterChangementFournisseurQuery } from './changement/consulter/consulterChangementFournisseur.query';
import { ConsulterFournisseurQuery } from './consulter/consulterFournisseur.query';

// Query
export type FournisseurQuery = ConsulterFournisseurQuery | ConsulterChangementFournisseurQuery;
export type { ConsulterFournisseurQuery, ConsulterChangementFournisseurQuery };

// ReadModel

// UseCases

// Event
export { FournisseurEvent } from './fournisseur.event';
export { FournisseurImportéEvent } from './importer/importerFournisseur.event';

// Register
export { registerFournisseurQueries } from './fournisseur.register';

// ValueTypes
export * as TypeFournisseur from './typeFournisseur.valueType';
export * as TypeDocumentFournisseur from './typeDocumentFournisseur.valueType';

// Entities
export * from './fournisseur.entity';
export * from './changement/changementFournisseur.entity';
