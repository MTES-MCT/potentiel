import { ConsulterAccuséRéceptionDemandeComplèteRaccordementQuery } from './consulter/consulterAccuséRéceptionDemandeComplèteRaccordement.query';
import { ConsulterDossierRaccordementQuery } from './consulter/consulterDossierRaccordement.query';
import { ConsulterPropositionTechniqueEtFinancièreSignéeQuery } from './consulter/consulterPropositionTechniqueEtFinancièreSignée.query';
import { ListerDossiersRaccordementQuery } from './lister/listerDossierRaccordement.query';
import { RechercherDossierRaccordementQuery } from './rechercher/rechercherDossierRaccordement.query';

type RaccordementQuery =
  | ConsulterAccuséRéceptionDemandeComplèteRaccordementQuery
  | ConsulterDossierRaccordementQuery
  | ConsulterPropositionTechniqueEtFinancièreSignéeQuery
  | ListerDossiersRaccordementQuery
  | RechercherDossierRaccordementQuery;

export {
  RaccordementQuery,
  ConsulterAccuséRéceptionDemandeComplèteRaccordementQuery,
  ConsulterDossierRaccordementQuery,
  ConsulterPropositionTechniqueEtFinancièreSignéeQuery,
  ListerDossiersRaccordementQuery,
  RechercherDossierRaccordementQuery,
};
