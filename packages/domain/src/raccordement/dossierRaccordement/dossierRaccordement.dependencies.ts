import { ConsulterDossierRaccordementDependencies } from './consulter/consulterDossierRaccordement.query';
import { ListerDossiersRaccordementQueryDependencies } from './lister/listerDossierRaccordement.query';

type QueryHandlerDependencies =
  | ConsulterDossierRaccordementDependencies
  | ListerDossiersRaccordementQueryDependencies;

export type DossierRaccordementDependencies = QueryHandlerDependencies;
