import {
  ModifierGestionnaireRéseauProjetDependencies,
  registerModifierGestionnaireRéseauProjetCommand,
} from './modifier/modifierGestionnaireRéseauProjet.command';
import { registerModifierGestionnaireRéseauProjetUseCase } from './modifier/modifierGestionnaireRéseauProjet.usecase';

export type ProjetDependencies = ModifierGestionnaireRéseauProjetDependencies;

export const setupProjet = (dependencies: ProjetDependencies) => {
  // Commands
  registerModifierGestionnaireRéseauProjetCommand(dependencies);

  // Use cases
  registerModifierGestionnaireRéseauProjetUseCase();
};
