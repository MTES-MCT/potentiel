import { registerConsulterProjetQuery } from './consulter/consulterProjet.query';
import { gestionnaireRéseauProjetModifiéHandlerFactory } from './modifierGestionnaireRéseau/handlers/gestionnaireRéseauProjetModifié.handler';
import { registerModifierGestionnaireRéseauProjetCommand } from './modifierGestionnaireRéseau/modifierGestionnaireRéseauProjet.command';
import { registerModifierGestionnaireRéseauProjetUseCase } from './modifierGestionnaireRéseauProjet.usecase';
import { ProjetDependencies } from './projet.dependencies';

export const setupProjet = (dependencies: ProjetDependencies) => {
  // Queries
  registerConsulterProjetQuery(dependencies);

  // Commands
  registerModifierGestionnaireRéseauProjetCommand(dependencies);

  // Use cases
  registerModifierGestionnaireRéseauProjetUseCase();

  // Subscribes
  const { subscribe } = dependencies;
  return [
    subscribe(
      'GestionnaireRéseauProjetModifié',
      gestionnaireRéseauProjetModifiéHandlerFactory(dependencies),
    ),
  ];
};
