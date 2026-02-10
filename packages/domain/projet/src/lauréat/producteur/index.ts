import {
  ConsulterChangementProducteurQuery,
  ConsulterChangementProducteurReadModel,
} from './changement/consulter/consulterChangementProducteur.query.js';
import { EnregistrerChangementProducteurUseCase } from './changement/enregistrerChangement/enregistrerChangement.usecase.js';
import {
  ListerChangementProducteurQuery,
  ListerChangementProducteurReadModel,
} from './changement/lister/listerChangementProducteur.query.js';
import {
  ConsulterProducteurQuery,
  ConsulterProducteurReadModel,
} from './consulter/consulterProducteur.query.js';
import {
  HistoriqueProducteurProjetListItemReadModel,
  ListerHistoriqueProducteurProjetQuery,
  ListerHistoriqueProducteurProjetReadModel,
} from './listerHistorique/listerHistoriqueProducteurProjet.query.js';
import { ModifierProducteurUseCase } from './modifier/modifierProducteur.usecase.js';

// Query
export type ProducteurQuery =
  | ConsulterProducteurQuery
  | ConsulterChangementProducteurQuery
  | ListerChangementProducteurQuery
  | ListerHistoriqueProducteurProjetQuery;

export type {
  ConsulterProducteurQuery,
  ConsulterChangementProducteurQuery,
  ListerChangementProducteurQuery,
  ListerHistoriqueProducteurProjetQuery,
};

// ReadModel
export type {
  ConsulterProducteurReadModel,
  ConsulterChangementProducteurReadModel,
  ListerChangementProducteurReadModel,
  ListerHistoriqueProducteurProjetReadModel,
  HistoriqueProducteurProjetListItemReadModel,
};

// UseCases
export type ProducteurUseCase = EnregistrerChangementProducteurUseCase | ModifierProducteurUseCase;
export type { EnregistrerChangementProducteurUseCase, ModifierProducteurUseCase };

// Event
export type { ProducteurEvent } from './producteur.event.js';
export type { ChangementProducteurEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangement.event.js';
export type { ProducteurModifiéEvent } from './modifier/modifierProducteur.event.js';
export type { ProducteurImportéEvent } from './importer/importerProducteur.event.js';

// Register
export { registerProducteurQueries, registerProducteurUseCases } from './producteur.register.js';

// ValueTypes
export * as TypeDocumentProducteur from './typeDocumentProducteur.valueType.js';

// Entities
export type * from './producteur.entity.js';
export type * from './changement/changementProducteur.entity.js';
