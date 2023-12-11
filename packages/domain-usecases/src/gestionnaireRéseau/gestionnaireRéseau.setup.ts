import { AjouterGestionnaireRéseauDependencies } from './ajouter/ajouterGestionnaireRéseau.command';
import { ModifierGestionnaireRéseauDependencies } from './modifier/modifierGestionnaireRéseau.command';

type GestionnaireRéseauDependencies = AjouterGestionnaireRéseauDependencies &
  ModifierGestionnaireRéseauDependencies;

export const setupGestionnaireRéseau = (dependencies: GestionnaireRéseauDependencies) => {
  // Sagas
  return [];
};
