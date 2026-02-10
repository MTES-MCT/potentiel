import type { AjouterGestionnaireRéseauUseCase } from './ajouter/ajouterGestionnaireRéseau.usecase.js';
import type {
  ConsulterGestionnaireRéseauQuery,
  ConsulterGestionnaireRéseauReadModel,
} from './consulter/consulterGestionnaireRéseau.query.js';
import type {
  ListerGestionnaireRéseauQuery,
  ListerGestionnaireRéseauReadModel,
  GestionnaireRéseauListItemReadModel,
} from './lister/listerGestionnaireRéseau.query.js';
import type { ModifierGestionnaireRéseauUseCase } from './modifier/modifierGestionnaireRéseau.usecase.js';
import type {
  GestionnaireRéseauAjoutéEvent,
  GestionnaireRéseauAjoutéEventV1,
} from './ajouter/ajouterGestionnaireRéseau.event.js';
import type { GestionnaireRéseauEvent } from './gestionnaireRéseau.event.js';
import type {
  GestionnaireRéseauModifiéEvent,
  GestionnaireRéseauModifiéEventV1,
} from './modifier/modifierGestionnaireRéseau.event.js';
import { GestionnaireRéseauAggregate } from './gestionnaireRéseau.aggregate.js';

// Query
export type GestionnaireRéseauQuery =
  | ListerGestionnaireRéseauQuery
  | ConsulterGestionnaireRéseauQuery;

export type { ListerGestionnaireRéseauQuery, ConsulterGestionnaireRéseauQuery };

// ReadModel
export type {
  ListerGestionnaireRéseauReadModel,
  GestionnaireRéseauListItemReadModel,
  ConsulterGestionnaireRéseauReadModel,
};

// UseCases
export type GestionnaireRéseauUseCase =
  | AjouterGestionnaireRéseauUseCase
  | ModifierGestionnaireRéseauUseCase;

export type { AjouterGestionnaireRéseauUseCase, ModifierGestionnaireRéseauUseCase };

// Event
export type {
  GestionnaireRéseauAjoutéEventV1,
  GestionnaireRéseauAjoutéEvent,
  GestionnaireRéseauEvent,
  GestionnaireRéseauModifiéEventV1,
  GestionnaireRéseauModifiéEvent,
};

// ValueTypes
export * as IdentifiantGestionnaireRéseau from './identifiantGestionnaireRéseau.valueType.js';

// Entities
export type * from './gestionnaireRéseau.entity.js';

// Aggregate
export { GestionnaireRéseauAggregate };
