import { Subscribe } from '@potentiel/core-domain';
import {
  GestionnaireRéseauProjetModifiéDependencies,
  gestionnaireRéseauProjetModifiéHandlerFactory,
} from './command/modifierGestionnaireRéseau/handlers/gestionnaireRéseauProjetModifié.handler';
import {
  ModifierGestionnaireRéseauProjetDependencies,
  registerModifierGestionnaireRéseauProjetCommand,
} from './command/modifierGestionnaireRéseau/modifierGestionnaireRéseauProjet.command';
import {
  ConsulterProjetDependencies,
  registerConsulterProjetQuery,
} from './query/consulter/consulterProjet.query';
import { registerConsulterProjetUseCase } from './usecase/consulterProjet.usecase';
import { registerModifierGestionnaireRéseauProjetUseCase } from './usecase/modifierGestionnaireRéseauProjet.usecase';

type QueryDependencies = ConsulterProjetDependencies;
type CommandDependencies = ModifierGestionnaireRéseauProjetDependencies;
type EventDependencies = GestionnaireRéseauProjetModifiéDependencies;

export type ProjetDependencies = { subscribe: Subscribe } & QueryDependencies &
  CommandDependencies &
  EventDependencies;

export const setupProjet = (dependencies: ProjetDependencies) => {
  // Queries
  registerConsulterProjetQuery(dependencies);

  // Commands
  registerModifierGestionnaireRéseauProjetCommand(dependencies);

  // Use cases
  registerConsulterProjetUseCase();
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
