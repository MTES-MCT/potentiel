import { get } from '@potentiel-libraries/http-client';

import {
  OREApiLimitInString,
  OREresultSchema,
  OreEndpoint,
  référentielDistributeursDEnergieUrl,
} from './constant';
import { OreGestionnaire } from './type';

type OreGestionnaireSlice = {
  gestionnaires: Array<OreGestionnaire>;
  totalCount: number;
};

const récupérerGRDParTranche = async (offset: string): Promise<OreGestionnaireSlice> => {
  const url = new URL(référentielDistributeursDEnergieUrl, OreEndpoint);
  url.searchParams.append('where', 'energie:"Électricité" and grd is not null');
  url.searchParams.append('select', 'grd, eic, contact');
  url.searchParams.append('limit', OREApiLimitInString);
  url.searchParams.append('offset', offset);

  const result = await get({ url });

  const parsedResult = OREresultSchema.parse(result);

  /**
   * Règle métier : quand aucun code EIC n'est fourni, on utilise la raison sociale (ou grd)
   */
  const parsedResultsWithNonNullableEIC = parsedResult.results.map((gestionnaire) => ({
    ...gestionnaire,
    eic: gestionnaire.eic ?? gestionnaire.grd,
  }));

  return {
    totalCount: parsedResult.total_count,
    gestionnaires: parsedResultsWithNonNullableEIC,
  };
};

export const récupérerTousLesGRD = async (
  offset: number = 0,
  gestionnaires: Array<OreGestionnaire> = [],
): Promise<Array<OreGestionnaire>> => {
  const gestionnaireSlice = await récupérerGRDParTranche(offset.toString());
  const updatedGestionnaires = gestionnaires.concat(gestionnaireSlice.gestionnaires);

  if (updatedGestionnaires.length < gestionnaireSlice.totalCount) {
    return récupérerTousLesGRD(
      offset + gestionnaireSlice.gestionnaires.length,
      updatedGestionnaires,
    );
  }

  return updatedGestionnaires;
};
