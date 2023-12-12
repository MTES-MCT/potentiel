import { AjouterGestionnaireRéseauUseCase } from './ajouter/ajouterGestionnaireRéseau.usecase';
import {
  ListerGestionnaireRéseauQuery,
  ListerGestionnaireRéseauReadModel,
} from './lister/listerGestionnaireRéseau.query';
import { ModifierGestionnaireRéseauUseCase } from './modifier/modifierGestionnaireRéseau.usecase';

// Query
export type GestionnaireRéseauQuery = ListerGestionnaireRéseauQuery;

export { ListerGestionnaireRéseauQuery };

// ReadModel
export { ListerGestionnaireRéseauReadModel };

// UseCases
export type GestionnaireRéseauUseCase =
  | AjouterGestionnaireRéseauUseCase
  | ModifierGestionnaireRéseauUseCase;

export { AjouterGestionnaireRéseauUseCase, ModifierGestionnaireRéseauUseCase };

// Event
export { GestionnaireRéseauEvent } from './gestionnaireRéseau.aggregate';
export { GestionnaireRéseauAjoutéEvent } from './ajouter/ajouterGestionnaireRéseau.behavior';
export { GestionnaireRéseauModifiéEvent } from './modifier/modifierGestionnaireRéseau.behavior';

// Register
export {
  registerGestionnaireRéseauQueries,
  registerGestionnaireRéseauUseCases,
} from './gestionnaireRéseau.register';

// ValueTypes
export * as IdentifiantGestionnaireRéseau from './identifiantGestionnaireRéseau.valueType';

// Projections
export * from './gestionnaireRéseau.projection';
