import { DemandeComplèteRaccordementDependencies } from './demandeCompléteRaccordement/demandCompléteRaccordement.setup';
import { DossierRaccordementDependencies } from './dossierRaccordement/dossierRaccordement.setup';
import { MiseEnServiceDependencies } from './miseEnService/miseEnService.setup';
import { PropostionTechniqueEtFinancièreDependencies } from './propositionTechniqueEtFinancière/propositionTechniqueEtFinancière.setup';

export type RaccordementDependencies = DossierRaccordementDependencies &
  DemandeComplèteRaccordementDependencies &
  MiseEnServiceDependencies &
  PropostionTechniqueEtFinancièreDependencies;
