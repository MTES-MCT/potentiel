import { LoadAggregate } from '@potentiel-domain/core';
import { registerAjouterGestionnaireRéseauCommand } from './ajouter/ajouterGestionnaireRéseau.command';
import { registerModifierGestionnaireRéseauCommand } from './modifier/modifierGestionnaireRéseau.command';
import { registerAjouterGestionnaireRéseauUseCase } from './ajouter/ajouterGestionnaireRéseau.usecase';
import { registerModifierGestionnaireRéseauUseCase } from './modifier/modifierGestionnaireRéseau.usecase';

export type GestionnaireRéseauQueryDependencies = {};
export type GestionnaireRéseauCommandDependencies = {
  loadAggregate: LoadAggregate;
};

export const registerGestionnaireRéseauUseCases = ({
  loadAggregate,
}: GestionnaireRéseauCommandDependencies) => {
  registerAjouterGestionnaireRéseauCommand(loadAggregate);
  registerModifierGestionnaireRéseauCommand(loadAggregate);

  registerAjouterGestionnaireRéseauUseCase();
  registerModifierGestionnaireRéseauUseCase();
};

export const registerGestionnaireRéseauQueries = (
  dependencies: GestionnaireRéseauQueryDependencies,
) => {};
