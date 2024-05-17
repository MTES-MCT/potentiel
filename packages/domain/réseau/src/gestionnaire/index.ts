import { AjouterGestionnaireRéseauUseCase } from './ajouter/ajouterGestionnaireRéseau.usecase';
import {
  ConsulterGestionnaireRéseauQuery,
  ConsulterGestionnaireRéseauReadModel,
} from './consulter/consulterGestionnaireRéseau.query';
import {
  ListerGestionnaireRéseauQuery,
  ListerGestionnaireRéseauReadModel,
} from './lister/listerGestionnaireRéseau.query';
import { ModifierGestionnaireRéseauUseCase } from './modifier/modifierGestionnaireRéseau.usecase';

// Query
export type GestionnaireRéseauQuery =
  | ListerGestionnaireRéseauQuery
  | ConsulterGestionnaireRéseauQuery;

export { ListerGestionnaireRéseauQuery, ConsulterGestionnaireRéseauQuery };

// ReadModel
export { ListerGestionnaireRéseauReadModel, ConsulterGestionnaireRéseauReadModel };

// UseCases
export type GestionnaireRéseauUseCase =
  | AjouterGestionnaireRéseauUseCase
  | ModifierGestionnaireRéseauUseCase;

export { AjouterGestionnaireRéseauUseCase, ModifierGestionnaireRéseauUseCase };

// Event
export { GestionnaireRéseauAjoutéEvent } from './ajouter/ajouterGestionnaireRéseau.behavior';
export { GestionnaireRéseauEvent } from './gestionnaireRéseau.aggregate';
export { GestionnaireRéseauModifiéEvent } from './modifier/modifierGestionnaireRéseau.behavior';

// ValueTypes
export * as IdentifiantGestionnaireRéseau from './identifiantGestionnaireRéseau.valueType';

// Entities
export * from './gestionnaireRéseau.entity';
