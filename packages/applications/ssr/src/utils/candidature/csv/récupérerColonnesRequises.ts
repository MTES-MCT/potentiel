import { AppelOffre } from '@potentiel-domain/appel-offre';

import {
  candidatureCsvHeadersMapping,
  CandidatureHeaders,
  CsvHeaders,
} from './candidatureCsv.schema';

type RécupérerColonnesRequisesProps = ({
  champsSupplémentaires,
}: {
  champsSupplémentaires: AppelOffre.ChampCandidature[] | undefined;
}) => CsvHeaders;

export const récupérerColonnesRequises: RécupérerColonnesRequisesProps = ({
  champsSupplémentaires,
}) => {
  const mappingChampSupplémentairesColonnes = {
    autorisationDUrbanisme: ['dateDAutorisationDUrbanisme', 'numéroDAutorisationDUrbanisme'],
    coefficientKChoisi: ['coefficientKChoisi'],
    dispositifDeStockage: [
      'installationAvecDispositifDeStockage',
      'capacitéDuDispositifDeStockageEnKWh',
      'puissanceDuDispositifDeStockageEnKW',
    ],
    installateur: ['installateur'],
    natureDeLExploitation: ['natureDeLExploitation', 'tauxPrévisionnelACI'],
    puissanceALaPointe: ['puissanceALaPointe'],
    puissanceDeSite: ['puissanceDeSite'],
    typologieInstallation: [
      'typeInstallationsAgrivoltaïques',
      'typologieDeBâtiment',
      'obligationDeSolarisation',
      'élémentsSousOmbrière',
    ],
    territoireProjet: ['territoireProjet'],
  } as const satisfies {
    [K in AppelOffre.ChampCandidature]: CandidatureHeaders;
  };

  const colonnesChampsSupplémentaires: CandidatureHeaders =
    champsSupplémentaires && champsSupplémentaires.length
      ? champsSupplémentaires.flatMap((champ) => mappingChampSupplémentairesColonnes[champ])
      : [];

  const toutesColonnesCorrespondantÀUnChampSupplémentaire: CandidatureHeaders = Object.values(
    mappingChampSupplémentairesColonnes,
  ).flat(); // permet de déduire les colonnes communes à tous les AOs

  const colonnesCommunesÀTousLesAOs = (
    Object.keys(candidatureCsvHeadersMapping) as CandidatureHeaders
  ).filter((key) => !toutesColonnesCorrespondantÀUnChampSupplémentaire.includes(key));

  return [...colonnesChampsSupplémentaires, ...colonnesCommunesÀTousLesAOs].map(
    (key) => candidatureCsvHeadersMapping[key],
  );
};
