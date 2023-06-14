import {
  AjouterGestionnaireRéseauDependencies,
  registerAjouterGestionnaireRéseauCommand,
} from './ajouter/ajouterGestionnaireRéseau.command';
import { registerAjouterGestionnaireRéseauUseCase } from './ajouter/ajouterGestionnaireRéseau.usecase';
import {
  ModifierGestionnaireRéseauDependencies,
  registerModifierGestionnaireRéseauCommand,
} from './modifier/modifierGestionnaireRéseau.command';
import { registerModifierGestionnaireRéseauUseCase } from './modifier/modifierGestionnaireRéseau.usecase';

type GestionnaireRéseauDependencies = AjouterGestionnaireRéseauDependencies &
  ModifierGestionnaireRéseauDependencies;

export const setupGestionnaireRéseau = (dependencies: GestionnaireRéseauDependencies) => {
  // Command
  registerAjouterGestionnaireRéseauCommand(dependencies);
  registerModifierGestionnaireRéseauCommand(dependencies);

  // Use cases
  registerAjouterGestionnaireRéseauUseCase();
  registerModifierGestionnaireRéseauUseCase();

  // Sagas
  return [];
};
