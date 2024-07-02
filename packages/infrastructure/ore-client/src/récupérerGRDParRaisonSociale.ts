import { get } from '@potentiel-libraries/http-client';
import { Option } from '@potentiel-libraries/monads';

import {
  OREresultSchema,
  OreEndpoint,
  OreGestionnaire,
  référentielDistributeursDEnergieUrl,
} from './constant';

export const récupérerGRDParRaisonSociale = async (
  raisonSociale: string,
): Promise<Option.Type<OreGestionnaire>> => {
  const url = new URL(référentielDistributeursDEnergieUrl, OreEndpoint);
  url.searchParams.append('where', `energie:"Électricité" and grd like '${raisonSociale}'`);
  url.searchParams.append('select', 'grd, eic, contact');
  url.searchParams.append('limit', '1');

  const result = await get(url);

  const parsedResult = OREresultSchema.parse(result);

  if (parsedResult.total_count === 0) {
    return Option.none;
  }
  /**
   * Règle métier : quand aucun code EIC n'est fourni, on utilise la raison sociale (ou grd)
   */
  return {
    grd: parsedResult.results[0].grd,
    eic: parsedResult.results[0].eic ?? parsedResult.results[0].grd,
    contact: parsedResult.results[0].contact,
  };
};
