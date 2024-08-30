import type { AjouterGestionnaireRéseauUseCase } from './ajouter/ajouterGestionnaireRéseau.usecase';
import type {
  ConsulterGestionnaireRéseauQuery,
  ConsulterGestionnaireRéseauReadModel,
} from './consulter/consulterGestionnaireRéseau.query';
import type {
  ListerGestionnaireRéseauQuery,
  ListerGestionnaireRéseauReadModel,
} from './lister/listerGestionnaireRéseau.query';
import type { ModifierGestionnaireRéseauUseCase } from './modifier/modifierGestionnaireRéseau.usecase';
import type { GestionnaireRéseauAjoutéEvent } from './ajouter/ajouterGestionnaireRéseau.behavior';
import type { GestionnaireRéseauEvent } from './gestionnaireRéseau.aggregate';
import type { GestionnaireRéseauModifiéEvent } from './modifier/modifierGestionnaireRéseau.behavior';
import {
  RechercherGestionnaireRéseauQuery,
  RechercherGestionnaireRéseauReadModel,
} from './rechercher/rechercherGestionnaireRéseau.query';

// Query
export type GestionnaireRéseauQuery =
  | ListerGestionnaireRéseauQuery
  | ConsulterGestionnaireRéseauQuery
  | RechercherGestionnaireRéseauQuery;

export {
  ListerGestionnaireRéseauQuery,
  ConsulterGestionnaireRéseauQuery,
  RechercherGestionnaireRéseauQuery,
};

// ReadModel
export {
  ListerGestionnaireRéseauReadModel,
  ConsulterGestionnaireRéseauReadModel,
  RechercherGestionnaireRéseauReadModel,
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
