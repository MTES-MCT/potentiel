import {
  ConsulterChangementProducteurQuery,
  ConsulterChangementProducteurReadModel,
} from './changement/consulter/consulterChangementProducteur.query';
import { EnregistrerChangementProducteurUseCase } from './changement/enregistrerChangement/enregistrerChangement.usecase';
import {
  ListerChangementProducteurQuery,
  ListerChangementProducteurReadModel,
} from './changement/lister/listerChangementProducteur.query';
import {
  ConsulterProducteurQuery,
  ConsulterProducteurReadModel,
} from './consulter/consulterProducteur.query';
import {
  HistoriqueProducteurProjetListItemReadModel,
  ListerHistoriqueProducteurProjetQuery,
  ListerHistoriqueProducteurProjetReadModel,
} from './listerHistorique/listerHistoriqueProducteurProjet.query';
import { ModifierProducteurUseCase } from './modifier/modifierProducteur.usecase';

// Query
export type ProducteurQuery =
  | ConsulterProducteurQuery
  | ConsulterChangementProducteurQuery
  | ListerChangementProducteurQuery
  | ListerHistoriqueProducteurProjetQuery;

export {
  ConsulterProducteurQuery,
  ConsulterChangementProducteurQuery,
  ListerChangementProducteurQuery,
  ListerHistoriqueProducteurProjetQuery,
};

// ReadModel
export {
  ConsulterProducteurReadModel,
  ConsulterChangementProducteurReadModel,
  ListerChangementProducteurReadModel,
  ListerHistoriqueProducteurProjetReadModel,
  HistoriqueProducteurProjetListItemReadModel,
};

// UseCases
export type ProducteurUseCase = EnregistrerChangementProducteurUseCase | ModifierProducteurUseCase;
export { EnregistrerChangementProducteurUseCase, ModifierProducteurUseCase };

// Event
export { ProducteurEvent } from './producteur.event';
export { ChangementProducteurEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangement.event';
export { ProducteurModifiéEvent } from './modifier/modifierProducteur.event';
export { ProducteurImportéEvent } from './importer/importerProducteur.event';

// Register
export { registerProducteurQueries, registerProducteurUseCases } from './producteur.register';

// ValueTypes
export * as TypeDocumentProducteur from './typeDocumentProducteur.valueType';

// Entities
export * from './producteur.entity';
export * from './changement/changementProducteur.entity';
