import type { AjouterGestionnaireRéseauUseCase } from './ajouter/ajouterGestionnaireRéseau.usecase';
import type {
  ConsulterGestionnaireRéseauQuery,
  ConsulterGestionnaireRéseauReadModel,
} from './consulter/consulterGestionnaireRéseau.query';
import type {
  ListerGestionnaireRéseauQuery,
  ListerGestionnaireRéseauReadModel,
  GestionnaireRéseauListItemReadModel,
} from './lister/listerGestionnaireRéseau.query';
import type { ModifierGestionnaireRéseauUseCase } from './modifier/modifierGestionnaireRéseau.usecase';
import type { GestionnaireRéseauAjoutéEvent } from './ajouter/ajouter.event';
import type { GestionnaireRéseauEvent } from './gestionnaireRéseau.event';
import type { GestionnaireRéseauModifiéEvent } from './modifier/modifierGestionnaireRéseau.event';
import { GestionnaireRéseauAggregate } from './gestionnaireRéseau.aggregate';

// Query
export type GestionnaireRéseauQuery =
  | ListerGestionnaireRéseauQuery
  | ConsulterGestionnaireRéseauQuery;

export { ListerGestionnaireRéseauQuery, ConsulterGestionnaireRéseauQuery };

// ReadModel
export {
  ListerGestionnaireRéseauReadModel,
  GestionnaireRéseauListItemReadModel,
  ConsulterGestionnaireRéseauReadModel,
};

// UseCases
export type GestionnaireRéseauUseCase =
  | AjouterGestionnaireRéseauUseCase
  | ModifierGestionnaireRéseauUseCase;

export { AjouterGestionnaireRéseauUseCase, ModifierGestionnaireRéseauUseCase };

// Event
export { GestionnaireRéseauAjoutéEvent, GestionnaireRéseauEvent, GestionnaireRéseauModifiéEvent };

// ValueTypes
export * as IdentifiantGestionnaireRéseau from './identifiantGestionnaireRéseau.valueType';

// Entities
export * from './gestionnaireRéseau.entity';

// Aggregate
export { GestionnaireRéseauAggregate };
