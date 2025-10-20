import { LoadAggregate } from '@potentiel-domain/core';

import { registerAjouterGestionnaireRéseauCommand } from './ajouter/ajouterGestionnaireRéseau.command';
import { registerModifierGestionnaireRéseauCommand } from './modifier/modifierGestionnaireRéseau.command';
import { registerAjouterGestionnaireRéseauUseCase } from './ajouter/ajouterGestionnaireRéseau.usecase';
import { registerModifierGestionnaireRéseauUseCase } from './modifier/modifierGestionnaireRéseau.usecase';
import {
  ListerGestionnaireRéseauQueryDependencies,
  registerListerGestionnaireRéseauQuery,
} from './lister/listerGestionnaireRéseau.query';
import {
  ConsulterGestionnaireRéseauQueryDependencies,
  registerConsulterGestionnaireRéseauQuery,
} from './consulter/consulterGestionnaireRéseau.query';

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
