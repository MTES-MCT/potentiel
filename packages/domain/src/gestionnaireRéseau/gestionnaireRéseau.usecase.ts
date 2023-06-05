import { AjouterGestionnaireRéseauUseCase } from './ajouter/ajouterGestionnaireRéseau.usecase';
import { ModifierGestionnaireRéseauUseCase } from './modifier/modifierGestionnaireRéseau.usecase';

export type GestionnaireRéseauUseCase =
  | AjouterGestionnaireRéseauUseCase
  | ModifierGestionnaireRéseauUseCase;
