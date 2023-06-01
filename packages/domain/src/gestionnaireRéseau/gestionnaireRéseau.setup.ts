import { Subscribe } from '@potentiel/core-domain';
import { gestionnaireRéseauAjoutéHandlerFactory, gestionnaireRéseauModifiéHandlerFactory } from '.';
import {
  AjouterGestionnaireRéseauDependencies,
  registerAjouterGestionnaireRéseauCommand,
} from './command/ajouter/ajouterGestionnaireRéseau.command';
import { GestionnaireRéseauAjoutéHandlerDependencies } from './command/ajouter/handlers/gestionnaireRéseauAjouté.handler';
import {
  ModifierGestionnaireRéseauDependencies,
  GestionnaireRéseauModifiéHandlerDependencies,
  registerModifierGestionnaireRéseauCommand,
} from './command/modifier';
import { registerConsulterGestionnaireRéseauUseCase } from './usecase/consulterGestionnaireRéseau.usecase';
import {
  ConsulterGestionnaireRéseauDependencies,
  registerConsulterGestionnaireRéseauQuery,
} from './query/consulter/consulterGestionnaireRéseau.query';
import {
  ListerGestionnaireRéseauDependencies,
  registerListerGestionnaireRéseauQuery,
} from './query/lister/listerGestionnaireRéseau.query';
import { registerAjouterGestionnaireRéseauUseCase } from './usecase/ajouterGestionnaireRéseau.usecase';
import { registerListerGestionnaireRéseauUseCase } from './usecase/listerGestionnaireRéseau.usecase';
import { registerModifierGestionnaireRéseauUseCase } from './usecase/modifierGestionnaireRéseau.usecase';

type QueryDependencies = ConsulterGestionnaireRéseauDependencies &
  ListerGestionnaireRéseauDependencies;
type CommandDependencies = AjouterGestionnaireRéseauDependencies &
  ModifierGestionnaireRéseauDependencies;
type EventDependencies = GestionnaireRéseauAjoutéHandlerDependencies &
  GestionnaireRéseauModifiéHandlerDependencies;

export type GestionnaireRéseauDependencies = { subscribe: Subscribe } & QueryDependencies &
  CommandDependencies &
  EventDependencies;

export const setupGestionnaireRéseau = (dependencies: GestionnaireRéseauDependencies) => {
  // Query
  registerConsulterGestionnaireRéseauQuery(dependencies);
  registerListerGestionnaireRéseauQuery(dependencies);

  // Command
  registerAjouterGestionnaireRéseauCommand(dependencies);
  registerModifierGestionnaireRéseauCommand(dependencies);

  // Use cases
  registerConsulterGestionnaireRéseauUseCase();
  registerListerGestionnaireRéseauUseCase();
  registerAjouterGestionnaireRéseauUseCase();
  registerModifierGestionnaireRéseauUseCase();

  // Subscribes
  const { subscribe } = dependencies;
  return [
    subscribe('GestionnaireRéseauAjouté', gestionnaireRéseauAjoutéHandlerFactory(dependencies)),
    subscribe('GestionnaireRéseauModifié', gestionnaireRéseauModifiéHandlerFactory(dependencies)),
  ];
};
