import type {
  ConsulterChangementProducteurQuery,
  ConsulterChangementProducteurReadModel,
} from './changement/consulter/consulterChangementProducteur.query.js';
import type { EnregistrerChangementProducteurUseCase } from './changement/enregistrerChangement/enregistrerChangement.usecase.js';
import type {
  ListerChangementProducteurQuery,
  ListerChangementProducteurReadModel,
} from './changement/lister/listerChangementProducteur.query.js';
import type {
  ConsulterProducteurQuery,
  ConsulterProducteurReadModel,
} from './consulter/consulterProducteur.query.js';
import type {
  HistoriqueProducteurProjetListItemReadModel,
  ListerHistoriqueProducteurProjetQuery,
  ListerHistoriqueProducteurProjetReadModel,
} from './listerHistorique/listerHistoriqueProducteurProjet.query.js';
import type { ModifierProducteurUseCase } from './modifier/modifierProducteur.usecase.js';
import type { CorrigerNuméroIdentificationUseCase } from './numéroIdentification/corriger/corrigerNuméroIdentification.usecase.js';

// Query
export type ProducteurQuery =
  | ConsulterProducteurQuery
  | ConsulterChangementProducteurQuery
  | ListerChangementProducteurQuery
  | ListerHistoriqueProducteurProjetQuery;

// ReadModel
export type {
  ConsulterChangementProducteurQuery,
  ConsulterChangementProducteurReadModel,
  ConsulterProducteurQuery,
  ConsulterProducteurReadModel,
  HistoriqueProducteurProjetListItemReadModel,
  ListerChangementProducteurQuery,
  ListerChangementProducteurReadModel,
  ListerHistoriqueProducteurProjetQuery,
  ListerHistoriqueProducteurProjetReadModel,
};

// UseCases
export type ProducteurUseCase =
  | EnregistrerChangementProducteurUseCase
  | ModifierProducteurUseCase
  | CorrigerNuméroIdentificationUseCase;

export type * from './changement/changementProducteur.entity.js';
export type { ChangementProducteurEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangement.event.js';
// ValueTypes
export * as DocumentProducteur from './documentProducteur.valueType.js';
export type { ProducteurImportéEvent } from './importer/importerProducteur.event.js';
export type { ProducteurModifiéEvent } from './modifier/modifierProducteur.event.js';
export type { NuméroIdentificationCorrigéEvent } from './numéroIdentification/corriger/corrigerNuméroIdentification.event.js';
export * as NuméroIdentification from './numéroIdentification.valueType.js';
// Entities
export type * from './producteur.entity.js';
// Event
export type { ProducteurEvent } from './producteur.event.js';
// Register
export { registerProducteurQueries, registerProducteurUseCases } from './producteur.register.js';
export type {
  CorrigerNuméroIdentificationUseCase,
  EnregistrerChangementProducteurUseCase,
  ModifierProducteurUseCase,
};
