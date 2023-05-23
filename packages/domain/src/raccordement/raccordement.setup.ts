import { setupDemandeCompléteRaccordement } from './demandeCompléteRaccordement/demandeCompléteRaccordement.setup';
import { setupDossierRaccordement } from './dossierRaccordement/dossierRaccordement.setup';
import { setupMiseEnPlace } from './miseEnService/miseEnService.setup';
import { setupPropostionTechniqueEtFinancière } from './propositionTechniqueEtFinancière/propositionTechniqueEtFinancière.setup';
import { RaccordementDependencies } from './raccordement.dependencies';

export const setupRaccordement = (dependencies: RaccordementDependencies) => {
  return [
    ...setupDemandeCompléteRaccordement(dependencies),
    ...setupDossierRaccordement(dependencies),
    ...setupMiseEnPlace(dependencies),
    ...setupPropostionTechniqueEtFinancière(dependencies),
  ];
};
