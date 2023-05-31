import { ConsulterDossierRaccordementDependencies } from './consulter/consulterDossierRaccordement.query';
import { ListerDossiersRaccordementQueryDependencies } from './lister/listerDossierRaccordement.query';
import { RechercherDossierRaccordementDependencies } from './rechercher/rechercherDossierRaccordement.query';

type QueryHandlerDependencies = ConsulterDossierRaccordementDependencies &
  ListerDossiersRaccordementQueryDependencies &
  RechercherDossierRaccordementDependencies;

export type DossierRaccordementDependencies = QueryHandlerDependencies;
