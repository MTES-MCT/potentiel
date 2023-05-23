import { registerConsulterDossierRaccordementQuery } from './consulter/consulterDossierRaccordement.query';
import { registerConsulterDossierRaccordementUseCase } from './consulterDossierRaccordement.usecase';
import { DossierRaccordementDependencies } from './dossierRaccordement.dependencies';
import { registerListerDossiersRaccordementQuery } from './lister/listerDossierRaccordement.query';
import { registerListerDossiersRaccordementUseCase } from './listerDossierRaccordement.usecase';

export const setupDossierRaccordement = (dependencies: DossierRaccordementDependencies) => {
  // Queries
  registerConsulterDossierRaccordementQuery(dependencies);
  registerListerDossiersRaccordementQuery(dependencies);

  // Usecases
  registerConsulterDossierRaccordementUseCase();
  registerListerDossiersRaccordementUseCase();

  // Subscribes
  return [];
};
