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
import { AttribuerGestionnaireRéseauAUnProjetUseCase } from './attribuerAUnProjet/attribuerGestionnaireRéseauAUnProjet.usecase';

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
  | ModifierGestionnaireRéseauUseCase
  | AttribuerGestionnaireRéseauAUnProjetUseCase;

export type {
  AjouterGestionnaireRéseauUseCase,
  ModifierGestionnaireRéseauUseCase,
  AttribuerGestionnaireRéseauAUnProjetUseCase,
};

// Event
export { GestionnaireRéseauAjoutéEvent, GestionnaireRéseauEvent, GestionnaireRéseauModifiéEvent };

// ValueTypes
export * as IdentifiantGestionnaireRéseau from './identifiantGestionnaireRéseau.valueType';

// Entities
export * from './gestionnaireRéseau.entity';
