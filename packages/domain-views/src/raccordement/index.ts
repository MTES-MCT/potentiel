import { Subscribe } from '../subscribe';
import {
  ConsulterAccuséRéceptionDemandeComplèteRaccordementQuery,
  ConsulterAccuséRéceptionDemandeComplèteRaccordementDependencies,
  registerConsulterAccuséRéceptionDemandeComplèteRaccordementQuery,
} from './consulter/consulterAccuséRéceptionDemandeComplèteRaccordement.query';
import {
  ConsulterDossierRaccordementQuery,
  ConsulterDossierRaccordementDependencies,
  registerConsulterDossierRaccordementQuery,
} from './consulter/consulterDossierRaccordement.query';
import {
  ConsulterPropositionTechniqueEtFinancièreSignéeQuery,
  ConsulterPropositionTechniqueEtFinancièreSignéeDependencies,
  registerConsulterPropositionTechniqueEtFinancièreSignéeQuery,
} from './consulter/consulterPropositionTechniqueEtFinancièreSignée.query';
import {
  ListerDossiersRaccordementQuery,
  ListerDossiersRaccordementQueryDependencies,
  registerListerDossiersRaccordementQuery,
} from './lister/listerDossierRaccordement.query';
import {
  RechercherDossierRaccordementQuery,
  RechercherDossierRaccordementDependencies,
  registerRechercherDossierRaccordementQuery,
} from './rechercher/rechercherDossierRaccordement.query';

// Queries
type RaccordementQuery =
  | ConsulterAccuséRéceptionDemandeComplèteRaccordementQuery
  | ConsulterDossierRaccordementQuery
  | ConsulterPropositionTechniqueEtFinancièreSignéeQuery
  | ListerDossiersRaccordementQuery
  | RechercherDossierRaccordementQuery;

// Setup
type RaccordementQueryDependencies = ConsulterDossierRaccordementDependencies &
  ConsulterAccuséRéceptionDemandeComplèteRaccordementDependencies &
  ConsulterPropositionTechniqueEtFinancièreSignéeDependencies &
  RechercherDossierRaccordementDependencies &
  ListerDossiersRaccordementQueryDependencies;

type RaccordementDependencies = {
  subscribe: Subscribe;
} & RaccordementQueryDependencies;

export const setupRaccordement = (dependencies: RaccordementDependencies) => {
  // Queries
  registerConsulterAccuséRéceptionDemandeComplèteRaccordementQuery(dependencies);
  registerConsulterDossierRaccordementQuery(dependencies);
  registerConsulterPropositionTechniqueEtFinancièreSignéeQuery(dependencies);
  registerListerDossiersRaccordementQuery(dependencies);
  registerRechercherDossierRaccordementQuery(dependencies);

  // Projector

  // Subscribes
  const { subscribe } = dependencies;

  return [];
};

export * from './raccordement.readModel';
export * from './raccordement.ports';

export {
  RaccordementQuery,
  ConsulterAccuséRéceptionDemandeComplèteRaccordementQuery,
  ConsulterDossierRaccordementQuery,
  ConsulterPropositionTechniqueEtFinancièreSignéeQuery,
  ListerDossiersRaccordementQuery,
  RechercherDossierRaccordementQuery,
};
