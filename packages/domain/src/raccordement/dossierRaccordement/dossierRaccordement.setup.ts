import { registerConsulterDossierRaccordementQuery } from './consulter/consulterDossierRaccordement.query';
import { DossierRaccordementDependencies } from './dossierRaccordement.dependencies';
import { registerListerDossiersRaccordementQuery } from './lister/listerDossierRaccordement.query';

export const setupDossierRaccordement = (dependencies: DossierRaccordementDependencies) => {
  // Queries
  registerConsulterDossierRaccordementQuery(dependencies);
  registerListerDossiersRaccordementQuery(dependencies);

  // Subscribes
  return [];
};
