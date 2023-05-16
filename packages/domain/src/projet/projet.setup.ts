import { Ports } from '../domain.ports';
import { registerModifierGestionnaireRéseauProjetCommand } from '../raccordement/modifierGestionnaireRéseauProjet/modifierGestionnaireRéseauProjet.command';
import { registerModifierGestionnaireRéseauProjetUseCase } from '../raccordement/modifierGestionnaireRéseauProjet/modifierGestionnaireRéseauProjet.usecase';
import { registerConsulterProjetQuery } from './consulter/consulterProjet.query';
import { gestionnaireRéseauProjetModifiéHandlerFactory } from './handlers/gestionnaireRéseauProjetModifié.handler';

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
