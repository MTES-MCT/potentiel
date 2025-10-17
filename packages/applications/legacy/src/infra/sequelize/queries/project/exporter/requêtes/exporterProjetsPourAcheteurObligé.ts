import { FiltreListeProjets } from '../../../../../../modules/project/queries/listerProjets';
import {
  coordonnéesCandidat,
  coordonnéesGéodésiques,
  donnéesAutoconsommation,
  donnéesDeRaccordement,
  donnéesFournisseurs,
  financementCitoyen,
  identificationProjet,
  implantation,
  localisationProjet,
  modificationsAvantImport,
  notes,
  prix,
  évaluationCarbone,
} from '../colonnesParCatégorie';
import { récupérerExportProjets } from './récupérerExportProjets';

const colonnesÀExporter = [
  ...identificationProjet,
  ...coordonnéesCandidat,
  ...financementCitoyen,
  ...localisationProjet,
  ...coordonnéesGéodésiques,
  ...donnéesAutoconsommation,
  ...donnéesDeRaccordement,
  ...donnéesFournisseurs,
  ...évaluationCarbone,
  ...implantation,
  ...prix,
  ...notes,
  ...modificationsAvantImport,
];

export const exporterProjetsPourAcheteurObligé = ({
  filtres,
}: {
  filtres?: FiltreListeProjets & { régions: string[] };
}) =>
  récupérerExportProjets({
    colonnesÀExporter,
    filtres,
  });
