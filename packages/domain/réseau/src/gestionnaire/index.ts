import type {
  GestionnaireRéseauAjoutéEvent,
  GestionnaireRéseauAjoutéEventV1,
} from './ajouter/ajouterGestionnaireRéseau.event.js';
import type { AjouterGestionnaireRéseauUseCase } from './ajouter/ajouterGestionnaireRéseau.usecase.js';
import type {
  ConsulterGestionnaireRéseauQuery,
  ConsulterGestionnaireRéseauReadModel,
} from './consulter/consulterGestionnaireRéseau.query.js';
import { GestionnaireRéseauAggregate } from './gestionnaireRéseau.aggregate.js';
import type { GestionnaireRéseauEvent } from './gestionnaireRéseau.event.js';
import type {
  GestionnaireRéseauListItemReadModel,
  ListerGestionnaireRéseauQuery,
  ListerGestionnaireRéseauReadModel,
} from './lister/listerGestionnaireRéseau.query.js';
import type {
  GestionnaireRéseauModifiéEvent,
  GestionnaireRéseauModifiéEventV1,
} from './modifier/modifierGestionnaireRéseau.event.js';
import type { ModifierGestionnaireRéseauUseCase } from './modifier/modifierGestionnaireRéseau.usecase.js';

// Query
export type GestionnaireRéseauQuery =
  | ListerGestionnaireRéseauQuery
  | ConsulterGestionnaireRéseauQuery;

// ReadModel
export type {
  ConsulterGestionnaireRéseauQuery,
  ConsulterGestionnaireRéseauReadModel,
  GestionnaireRéseauListItemReadModel,
  ListerGestionnaireRéseauQuery,
  ListerGestionnaireRéseauReadModel,
};

// UseCases
export type GestionnaireRéseauUseCase =
  | AjouterGestionnaireRéseauUseCase
  | ModifierGestionnaireRéseauUseCase;

// Entities
export type * from './gestionnaireRéseau.entity.js';
// ValueTypes
export * as IdentifiantGestionnaireRéseau from './identifiantGestionnaireRéseau.valueType.js';
// Event
export type {
  AjouterGestionnaireRéseauUseCase,
  GestionnaireRéseauAjoutéEvent,
  GestionnaireRéseauAjoutéEventV1,
  GestionnaireRéseauEvent,
  GestionnaireRéseauModifiéEvent,
  GestionnaireRéseauModifiéEventV1,
  ModifierGestionnaireRéseauUseCase,
};
// Aggregate
export { GestionnaireRéseauAggregate };
