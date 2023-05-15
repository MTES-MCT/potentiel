import { Ports } from '../domain.ports';
import { registerAjouterGestionnaireRéseauCommand } from './ajouter/ajouterGestionnaireRéseau.command';
import { registerConsulterGestionnaireRéseauQuery } from './consulter/consulterGestionnaireRéseau.query';
import { registerListerGestionnaireRéseauQuery } from './lister/listerGestionnaireRéseau.query';
import { registerModifierGestionnaireRéseauCommand } from './modifier/modifierGestionnaireRéseau.command';

export const setupGestionnaireRéseau = ({ commandPorts, queryPorts }: Ports) => {
  // Query
  registerConsulterGestionnaireRéseauQuery(queryPorts);
  registerListerGestionnaireRéseauQuery(queryPorts);

  // Command
  registerAjouterGestionnaireRéseauCommand(commandPorts);
  registerModifierGestionnaireRéseauCommand(commandPorts);

  // Use case
};
