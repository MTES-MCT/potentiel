import type {
  GestionnaireRéseauAjoutéEvent,
  GestionnaireRéseauAjoutéEventV1,
} from './ajouter/ajouterGestionnaireRéseau.event';
import type { AjouterGestionnaireRéseauUseCase } from './ajouter/ajouterGestionnaireRéseau.usecase';
import type {
  ConsulterGestionnaireRéseauQuery,
  ConsulterGestionnaireRéseauReadModel,
} from './consulter/consulterGestionnaireRéseau.query';
import { GestionnaireRéseauAggregate } from './gestionnaireRéseau.aggregate';
import type { GestionnaireRéseauEvent } from './gestionnaireRéseau.event';
import type {
  GestionnaireRéseauListItemReadModel,
  ListerGestionnaireRéseauQuery,
  ListerGestionnaireRéseauReadModel,
} from './lister/listerGestionnaireRéseau.query';
import type {
  GestionnaireRéseauModifiéEvent,
  GestionnaireRéseauModifiéEventV1,
} from './modifier/modifierGestionnaireRéseau.event';
import type { ModifierGestionnaireRéseauUseCase } from './modifier/modifierGestionnaireRéseau.usecase';

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

// Entities
export * from './gestionnaireRéseau.entity';
// ValueTypes
export * as IdentifiantGestionnaireRéseau from './identifiantGestionnaireRéseau.valueType';

// Aggregate
export { GestionnaireRéseauAggregate };
