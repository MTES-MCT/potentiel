import { FiltreListeProjets } from '@modules/project/queries/listerProjets';
import {
  contenuLocal,
  coordonnéesCandidat,
  coordonnéesGéodésiques,
  coûtInvestissement,
  donnéesAutoconsommation,
  donnéesDeRaccordement,
  donnéesFournisseurs,
  financementCitoyen,
  garantiesFinancières,
  identificationProjet,
  implantation,
  instruction,
  localisationProjet,
  modificationsAvantImport,
  noteInnovation,
  noteInnovationSensible,
  notes,
  potentielSolaire,
  prix,
  référencesCandidature,
  résultatInstructionSensible,
  évaluationCarbone,
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
  ...référencesCandidature,
  ...instruction,
  ...résultatInstructionSensible,
  ...noteInnovation,
  ...noteInnovationSensible,
  ...notes,
  ...modificationsAvantImport,
  ...garantiesFinancières,
];

export const exporterProjetsPourCRE = ({ filtres }: { filtres?: FiltreListeProjets }) =>
  récupérerExportProjets({ colonnesÀExporter, filtres, inclureLesProjetsNonNotifiés: true });
