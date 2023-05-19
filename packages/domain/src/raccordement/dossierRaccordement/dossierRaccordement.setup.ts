import {
  ConsulterDossierRaccordementDependencies,
  registerConsulterDossierRaccordementQuery,
} from './consulter/consulterDossierRaccordement.query';
import {
  ListerDossiersRaccordementQueryDependencies,
  registerListerDossiersRaccordementQuery,
} from './lister/listerDossierRaccordement.query';

type QueryHandlerDependencies =
  | ConsulterDossierRaccordementDependencies
  | ListerDossiersRaccordementQueryDependencies;

export type DossierRaccordementDependencies = QueryHandlerDependencies;

export const setupDossierRaccordement = (dependencies: DossierRaccordementDependencies) => {
  // Queries
  registerConsulterDossierRaccordementQuery(dependencies);
  registerListerDossiersRaccordementQuery(dependencies);

  // Subscribes
  return [];
};
