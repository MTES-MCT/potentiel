import { DomainDependencies } from '../domain.dependencies';
import { registerConsulterProjetQuery } from './consulter/consulterProjet.query';
import { gestionnaireRéseauProjetModifiéHandlerFactory } from './handlers/gestionnaireRéseauProjetModifié.handler';
import {
  registerModifierGestionnaireRéseauProjetCommand,
  registerModifierGestionnaireRéseauProjetUseCase,
} from './modifierGestionnaireRéseau';

export const setupProjet = ({
  command: commandPorts,
  query: queryPorts,
  event: eventPorts,
  subscribe,
}: DomainDependencies) => {
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
