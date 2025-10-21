import { FiltreListeProjets } from '../../../../../../modules/project/queries/listerProjets';
import { UserRole } from '../../../../../../modules/users';
import {
  contenuLocal,
  coordonnéesCandidat,
  coordonnéesGéodésiques,
  coûtInvestissement,
  donnéesAutoconsommation,
  donnéesDeRaccordement,
  donnéesFournisseurs,
  financementCitoyen,
  identificationProjet,
  implantation,
  localisationProjet,
  modificationsAvantImport,
  potentielSolaire,
  prix,
  résultatInstructionSensible,
  évaluationCarbone,
  noteInnovation,
} from '../colonnesParCatégorie';
import { récupérerExportProjets } from './récupérerExportProjets';

const colonnesÀExporter = [
  ...identificationProjet,
  ...coordonnéesCandidat,
  ...financementCitoyen,
  ...contenuLocal,
  ...localisationProjet,
  ...coordonnéesGéodésiques,
  ...coûtInvestissement,
  ...donnéesAutoconsommation,
  ...donnéesDeRaccordement,
  ...donnéesFournisseurs,
  ...évaluationCarbone,
  ...potentielSolaire,
  ...implantation,
  ...prix,
  ...résultatInstructionSensible,
  ...noteInnovation,
  ...modificationsAvantImport,
];

export const exporterProjetsPourPorteurDeProjet = ({
  filtres,
}: {
  filtres?: FiltreListeProjets & { projets: Array<string> };
}) =>
  récupérerExportProjets({
    colonnesÀExporter,
    filtres,
  });
