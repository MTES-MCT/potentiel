import { FiltreListeProjets } from '../../../../../../modules/project/queries/listerProjets';
import {
  contenuLocal,
  coûtInvestissement,
  donnéesAutoconsommation,
  donnéesFournisseurs,
  financementCitoyen,
  identificationProjet,
  implantation,
  localisationProjet,
  modificationsAvantImport,
  noteInnovation,
  noteInnovationSensible,
  potentielSolaire,
  évaluationCarbone,
} from '../colonnesParCatégorie';
import { récupérerExportProjets } from './récupérerExportProjets';

const colonnesÀExporter = [
  ...identificationProjet,
  ...financementCitoyen,
  ...contenuLocal,
  ...localisationProjet,
  ...coûtInvestissement,
  ...donnéesAutoconsommation,
  ...donnéesFournisseurs,
  ...évaluationCarbone,
  ...potentielSolaire,
  ...implantation,
  ...noteInnovation,
  ...noteInnovationSensible,
  ...modificationsAvantImport,
];

export const exporterProjetsPourADEME = ({ filtres }: { filtres?: FiltreListeProjets }) =>
  récupérerExportProjets({ colonnesÀExporter, filtres });
