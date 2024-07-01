import { get } from '@potentiel-libraries/http-client';

import {
  OreEndpoint,
  OreGestionnaire,
  gestionnaireSchema,
  référentielDistributeursDEnergieUrl,
} from './constant';

export const récupérerGRDParEIC = async (codeEIC: string): Promise<OreGestionnaire> => {
  const url = new URL(référentielDistributeursDEnergieUrl, OreEndpoint);
  url.searchParams.append(
    'where',
    `energie:"Électricité" and grd is not null and eic is ${codeEIC}`,
  );
  url.searchParams.append('select', 'grd, eic, contact');
  url.searchParams.append('limit', '1');

  const result = await get(url);

  const parsedResult = gestionnaireSchema.parse(result);

  /**
   * Règle métier : quand aucun code EIC n'est fourni, on utilise la raison sociale (ou grd)
   */
  const parsedResultsWithNonNullableEIC = {
    grd: parsedResult.grd,
    eic: parsedResult.eic ?? parsedResult.grd,
    contact: parsedResult.contact,
  };

  return parsedResultsWithNonNullableEIC;
};
