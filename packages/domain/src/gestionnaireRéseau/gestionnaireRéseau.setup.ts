import { registerAjouterGestionnaireRéseauCommand } from './ajouter/ajouterGestionnaireRéseau.command';
import { gestionnaireRéseauAjoutéHandlerFactory } from './ajouter/handlers/gestionnaireRéseauAjouté.handler';
import { registerConsulterGestionnaireRéseauQuery } from './consulter/consulterGestionnaireRéseau.query';
import { registerConsulterGestionnaireRéseauUseCase } from './consulterGestionnaireRéseau.usecase';
import { GestionnaireRéseauDependencies } from './gestionnaireRéseau.dependencies';
import { registerListerGestionnaireRéseauQuery } from './lister/listerGestionnaireRéseau.query';
import { gestionnaireRéseauModifiéHandlerFactory } from './modifier';
import { registerModifierGestionnaireRéseauCommand } from './modifier/modifierGestionnaireRéseau.command';

export const setupGestionnaireRéseau = (dependencies: GestionnaireRéseauDependencies) => {
  // Query
  registerConsulterGestionnaireRéseauQuery(dependencies);
  registerListerGestionnaireRéseauQuery(dependencies);

  // Command
  registerAjouterGestionnaireRéseauCommand(dependencies);
  registerModifierGestionnaireRéseauCommand(dependencies);

  // Use cases
  registerConsulterGestionnaireRéseauUseCase();

  // Subscribes
  const { subscribe } = dependencies;
  return [
    subscribe('GestionnaireRéseauAjouté', gestionnaireRéseauAjoutéHandlerFactory(dependencies)),
    subscribe('GestionnaireRéseauModifié', gestionnaireRéseauModifiéHandlerFactory(dependencies)),
  ];
};
