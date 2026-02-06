import { candidatureCsvHeadersMapping } from '@/utils/candidature';

type RécupérerColonnesRequisesPourLAOImporté = (appelOffres: string) => ReadonlyArray<string>;

export const récupérerColonnesRequisesPourLAOImporté: RécupérerColonnesRequisesPourLAOImporté = (
  appelOffres,
) => {
  const appelOffreColumnsMap: Record<string, (keyof typeof candidatureCsvHeadersMapping)[]> = {
    'PPE2 - Petit PV Bâtiment': [
      'installateur',
      'installationAvecDispositifDeStockage',
      'puissanceDuDispositifDeStockageEnKW',
      'capacitéDuDispositifDeStockageEnKWh',
      'natureDeLExploitation',
      'tauxPrévisionnelACI',
      'dateDAutorisationDUrbanisme',
      'numéroDAutorisationDUrbanisme',
      'puissanceDeSite',
    ],

    'CRE4 - ZNI': ['territoireProjet'],

    'PPE2 - Sol': [
      'typeInstallationsAgrivoltaïques',
      'typologieDeBâtiment',
      'obligationDeSolarisation',
      'élémentsSousOmbrière',
    ],

    'PPE2 - Bâtiment': [
      'typeInstallationsAgrivoltaïques',
      'typologieDeBâtiment',
      'obligationDeSolarisation',
      'élémentsSousOmbrière',
    ],

    'PPE2 - Neutre': [
      'typeInstallationsAgrivoltaïques',
      'typologieDeBâtiment',
      'obligationDeSolarisation',
      'élémentsSousOmbrière',
    ],

    'PPE2 - ZNI': [
      'typeInstallationsAgrivoltaïques',
      'typologieDeBâtiment',
      'obligationDeSolarisation',
      'élémentsSousOmbrière',
    ],
  };

  const allSpecificColumns = new Set<keyof typeof candidatureCsvHeadersMapping>(
    Object.values(appelOffreColumnsMap).flat(),
  );

  const commonColumns = (
    Object.keys(candidatureCsvHeadersMapping) as (keyof typeof candidatureCsvHeadersMapping)[]
  ).filter((key) => !allSpecificColumns.has(key));

  const specificColumnsForAO = appelOffreColumnsMap[appelOffres] || [];

  const allColumnsKeys = [...commonColumns, ...specificColumnsForAO];

  return allColumnsKeys.map((key) => candidatureCsvHeadersMapping[key]);
};
