import { Ports } from '../domain.ports';
import { registerConsulterProjetQuery } from './consulter/consulterProjet.query';
import { gestionnaireRéseauProjetModifiéHandlerFactory } from './handlers/gestionnaireRéseauProjetModifié.handler';
import {
  registerModifierGestionnaireRéseauProjetCommand,
  registerModifierGestionnaireRéseauProjetUseCase,
} from './modifierGestionnaireRéseau';

export const setupProjet = ({ commandPorts, queryPorts, eventPorts, subscribe }: Ports) => {
  // Queries
  registerConsulterProjetQuery(queryPorts);

  // Commands
  registerModifierGestionnaireRéseauProjetCommand(commandPorts);

  // Use cases
  registerModifierGestionnaireRéseauProjetUseCase();

  // Events
  return [
    subscribe(
      'GestionnaireRéseauProjetModifié',
      gestionnaireRéseauProjetModifiéHandlerFactory(eventPorts),
    ),
  ];
};
