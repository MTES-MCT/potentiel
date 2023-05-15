import { Ports } from '../domain.ports';
import { registerModifierGestionnaireRéseauProjetCommand } from '../raccordement/modifierGestionnaireRéseauProjet/modifierGestionnaireRéseauProjet.command';
import { registerModifierGestionnaireRéseauProjetUseCase } from '../raccordement/modifierGestionnaireRéseauProjet/modifierGestionnaireRéseauProjet.usecase';
import { registerConsulterProjetQuery } from './consulter/consulterProjet.query';

export const setupProjet = ({ commandPorts, queryPorts }: Ports) => {
  // Query
  registerConsulterProjetQuery(queryPorts);

  // Command
  registerModifierGestionnaireRéseauProjetCommand(commandPorts);

  // Use case
  registerModifierGestionnaireRéseauProjetUseCase();
};
