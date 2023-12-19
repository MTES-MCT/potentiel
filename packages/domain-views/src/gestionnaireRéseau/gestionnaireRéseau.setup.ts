import { Subscribe } from '@potentiel/core-domain';
import {
  ConsulterGestionnaireRéseauDependencies,
} from './consulter/consulterGestionnaireRéseau.query';
import { GestionnaireRéseauProjectorDependencies } from './gestionnaireRéseau.projector';
import { ListerGestionnaireRéseauDependencies } from './lister/listerGestionnaireRéseau.query';

// Setup
type GestionnaireRéseauDependencies = {
  subscribe: Subscribe;
} & ConsulterGestionnaireRéseauDependencies &
  ListerGestionnaireRéseauDependencies &
  GestionnaireRéseauProjectorDependencies;

export const setupGestionnaireRéseauViews = async (
  dependencies: GestionnaireRéseauDependencies,
) => {
  return [];
};
