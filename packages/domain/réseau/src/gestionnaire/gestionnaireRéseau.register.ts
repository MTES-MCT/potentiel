import { LoadAggregate } from '@potentiel-domain/core';

import { registerAjouterGestionnaireRéseauCommand } from './ajouter/ajouterGestionnaireRéseau.command.js';
import { registerModifierGestionnaireRéseauCommand } from './modifier/modifierGestionnaireRéseau.command.js';
import { registerAjouterGestionnaireRéseauUseCase } from './ajouter/ajouterGestionnaireRéseau.usecase.js';
import { registerModifierGestionnaireRéseauUseCase } from './modifier/modifierGestionnaireRéseau.usecase.js';
import {
  ListerGestionnaireRéseauQueryDependencies,
  registerListerGestionnaireRéseauQuery,
} from './lister/listerGestionnaireRéseau.query.js';
import {
  ConsulterGestionnaireRéseauQueryDependencies,
  registerConsulterGestionnaireRéseauQuery,
} from './consulter/consulterGestionnaireRéseau.query.js';

export type GestionnaireRéseauQueryDependencies = ListerGestionnaireRéseauQueryDependencies &
  ConsulterGestionnaireRéseauQueryDependencies;

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
) => {
  registerConsulterGestionnaireRéseauQuery(dependencies);
  registerListerGestionnaireRéseauQuery(dependencies);
};
