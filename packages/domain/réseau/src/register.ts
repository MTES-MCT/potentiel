import {
  GestionnaireRéseauCommandDependencies,
  GestionnaireRéseauQueryDependencies,
  registerGestionnaireRéseauQueries,
  registerGestionnaireRéseauUseCases,
} from './gestionnaire/gestionnaireRéseau.register.js';

export type RéseauQueryDependencies = GestionnaireRéseauQueryDependencies;
export type RéseauCommandDependencies = GestionnaireRéseauCommandDependencies;

export const registerRéseauUseCases = (dependencies: RéseauCommandDependencies) => {
  registerGestionnaireRéseauUseCases(dependencies);
};

export const registerRéseauQueries = (dependencies: RéseauQueryDependencies) => {
  registerGestionnaireRéseauQueries(dependencies);
};
