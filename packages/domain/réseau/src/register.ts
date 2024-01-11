import {
  GestionnaireRéseauCommandDependencies,
  GestionnaireRéseauQueryDependencies,
  registerGestionnaireRéseauQueries,
  registerGestionnaireRéseauUseCases,
} from './gestionnaire/gestionnaireRéseau.register';
import {
  RaccordementCommandDependencies,
  RaccordementQueryDependencies,
  registerRaccordementQueries,
  registerRaccordementUseCases,
} from './raccordement/raccordement.register';

export type RéseauQueryDependencies = GestionnaireRéseauQueryDependencies &
  RaccordementQueryDependencies;
export type RéseauCommandDependencies = GestionnaireRéseauCommandDependencies &
  RaccordementCommandDependencies;

export const registerRéseauUseCases = (dependencies: RéseauCommandDependencies) => {
  registerGestionnaireRéseauUseCases(dependencies);
  registerRaccordementUseCases(dependencies);
};

export const registerRéseauQueries = (dependencies: RéseauQueryDependencies) => {
  registerGestionnaireRéseauQueries(dependencies);
  registerRaccordementQueries(dependencies);
};
