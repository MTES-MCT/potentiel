import type { LoadAggregateV2 } from '@potentiel-domain/core';

import { registerAjouterGestionnaireRéseauCommand } from './ajouter/ajouterGestionnaireRéseau.command';
import { registerAjouterGestionnaireRéseauUseCase } from './ajouter/ajouterGestionnaireRéseau.usecase';
import {
  type ConsulterGestionnaireRéseauQueryDependencies,
  registerConsulterGestionnaireRéseauQuery,
} from './consulter/consulterGestionnaireRéseau.query';
import {
  type ListerGestionnaireRéseauQueryDependencies,
  registerListerGestionnaireRéseauQuery,
} from './lister/listerGestionnaireRéseau.query';
import { registerModifierGestionnaireRéseauCommand } from './modifier/modifierGestionnaireRéseau.command';
import { registerModifierGestionnaireRéseauUseCase } from './modifier/modifierGestionnaireRéseau.usecase';

export type GestionnaireRéseauQueryDependencies = ListerGestionnaireRéseauQueryDependencies &
  ConsulterGestionnaireRéseauQueryDependencies;

export type GestionnaireRéseauCommandDependencies = {
  loadAggregate: LoadAggregateV2;
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
