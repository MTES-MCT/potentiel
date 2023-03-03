import { FiltreListeProjets } from '@modules/project/queries/listerProjets';
import {
  coordonnéesCandidat,
  coordonnéesGéodésiques,
  donnéesAutoconsommation,
  donnéesDeRaccordement,
  donnéesFournisseurs,
  financementCitoyen,
  garantiesFinancières,
  identificationProjet,
  implantation,
  localisationProjet,
  modificationsAvantImport,
  prix,
  référencesCandidature,
  résultatInstructionSensible,
  évaluationCarbone,
} from '../colonnesParCatégorie';
import { récupérerExportProjets } from './récupérerExportProjets';
import { wrapInfra } from '@core/utils';
import { UserDreal } from '@infra/sequelize/projectionsNext';

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
  ...référencesCandidature,
  ...résultatInstructionSensible,
  ...modificationsAvantImport,
  ...garantiesFinancières,
];

export const exporterProjetsPourDREAL = ({
  filtres,
  userId,
}: {
  userId: string;
  filtres?: FiltreListeProjets;
}) =>
  wrapInfra(
    UserDreal.findOne({
      where: { userId },
      attributes: ['dreal'],
    }),
  ).andThen((régionDreal: any) =>
    récupérerExportProjets({
      colonnesÀExporter,
      filtres,
      seulementLesProjetsParRégion: régionDreal.dreal,
    }),
  );
