import { FiltreListeProjets } from '../../../../../../modules/project/queries/listerProjets';
import {
  coordonnéesCandidat,
  identificationProjet,
  localisationProjet,
} from '../colonnesParCatégorie';
import { récupérerExportProjets } from './récupérerExportProjets';

const colonnesÀExporter = [...identificationProjet, ...coordonnéesCandidat, ...localisationProjet];

export const exporterProjetsPourCaisseDesDépôts = ({ filtres }: { filtres?: FiltreListeProjets }) =>
  récupérerExportProjets({ colonnesÀExporter, filtres });
