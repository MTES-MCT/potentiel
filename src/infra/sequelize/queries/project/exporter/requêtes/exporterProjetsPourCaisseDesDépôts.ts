import { FiltreListeProjets } from '../../../../../../modules/project/queries/listerProjets';
import {
  coordonnéesCandidat,
  garantiesFinancières,
  identificationProjet,
  localisationProjet,
} from '../colonnesParCatégorie';
import { récupérerExportProjets } from './récupérerExportProjets';

const colonnesÀExporter = [
  ...identificationProjet,
  ...coordonnéesCandidat,
  ...localisationProjet,
  ...garantiesFinancières,
];

export const exporterProjetsPourCaisseDesDépôts = ({ filtres }: { filtres?: FiltreListeProjets }) =>
  récupérerExportProjets({ colonnesÀExporter, filtres });
