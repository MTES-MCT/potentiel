import { DemandeComplèteRaccordementDependencies } from './demandeCompléteRaccordement/demandeCompléteRaccordement.dependencies';
import { DossierRaccordementDependencies } from './dossierRaccordement/dossierRaccordement.dependencies';
import { MiseEnServiceDependencies } from './miseEnService/miseEnService.dependencies';
import { PropostionTechniqueEtFinancièreDependencies } from './propositionTechniqueEtFinancière/propositionTechniqueEtFinancière.dependencies';

export type RaccordementDependencies = DossierRaccordementDependencies &
  DemandeComplèteRaccordementDependencies &
  MiseEnServiceDependencies &
  PropostionTechniqueEtFinancièreDependencies;
