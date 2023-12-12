import { Subscribe } from '@potentiel/core-domain';
import {
  ConsulterGestionnaireRéseauDependencies,
  registerConsulterGestionnaireRéseauQuery,
} from './consulter/consulterGestionnaireRéseau.query';
import {
  GestionnaireRéseauProjectorDependencies,
} from './gestionnaireRéseau.projector';
import {
  ListerGestionnaireRéseauDependencies,
} from './lister/listerGestionnaireRéseau.query';

// Setup
type GestionnaireRéseauDependencies = {
  subscribe: Subscribe;
} & ConsulterGestionnaireRéseauDependencies &
  ListerGestionnaireRéseauDependencies &
  GestionnaireRéseauProjectorDependencies;

export const setupGestionnaireRéseauViews = async (
  dependencies: GestionnaireRéseauDependencies,
) => {
  // Query
  registerConsulterGestionnaireRéseauQuery(dependencies);

  return [];
};
