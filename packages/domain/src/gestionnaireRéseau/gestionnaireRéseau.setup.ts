import { DomainDependencies } from '../domain.dependencies';
import { gestionnaireRéseauAjoutéHandlerFactory } from './ajouter';
import { registerAjouterGestionnaireRéseauCommand } from './ajouter/ajouterGestionnaireRéseau.command';
import { registerConsulterGestionnaireRéseauQuery } from './consulter/consulterGestionnaireRéseau.query';
import { registerListerGestionnaireRéseauQuery } from './lister/listerGestionnaireRéseau.query';
import { gestionnaireRéseauModifiéHandlerFactory } from './modifier';
import { registerModifierGestionnaireRéseauCommand } from './modifier/modifierGestionnaireRéseau.command';

export const setupGestionnaireRéseau = ({
  command: commandPorts,
  query: queryPorts,
  event: eventPorts,
  subscribe,
}: DomainDependencies) => {
  // Query
  registerConsulterGestionnaireRéseauQuery(queryPorts);
  registerListerGestionnaireRéseauQuery(queryPorts);

  // Command
  registerAjouterGestionnaireRéseauCommand(commandPorts);
  registerModifierGestionnaireRéseauCommand(commandPorts);

  // Use cases

  // Events
  return [
    subscribe('GestionnaireRéseauAjouté', gestionnaireRéseauAjoutéHandlerFactory(eventPorts)),
    subscribe('GestionnaireRéseauModifié', gestionnaireRéseauModifiéHandlerFactory(eventPorts)),
  ];
};
