import { get } from '@potentiel-libraries/http-client';
import zod from 'zod';

import { OreEndpoint } from './constant';
import { getLogger } from '@potentiel-libraries/monitoring';
import { GestionnaireRéseau as Gestionnaire } from '@potentiel-domain/reseau';

const schema = zod.object({
  total_count: zod.number(),
  results: zod
    .array(
      zod.object({
        grd_elec: zod.string(),
        grd_elec_eic: zod.string(),
      }),
    )
    .max(1),
});

type Params = {
  codePostal: string;
  commune: string;
};

export type OreGestionnaireByCity = Pick<
  Gestionnaire.GestionnaireRéseauEntity,
  'raisonSociale' | 'codeEIC'
>;

export const getGRDByCity = async ({
  codePostal,
  commune,
}: Params): Promise<OreGestionnaireByCity> => {
  const searchParams = new URLSearchParams();
  searchParams.append('where', `code_postal:"${codePostal}" and commune like "${commune}"`);
  searchParams.append('select', 'grd_elec, grd_elec_eic');
  searchParams.append('limit', '1');

  const url = new URL(
    `${OreEndpoint}referentiel-distributeurs-denergie/records?${searchParams.toString()}`,
  );

  const result = await get(url);

  const parsedResult = schema.parse(result);

  if (parsedResult.total_count === 0) {
    getLogger().warn(`No GRD could be found for codePostal ${codePostal} and commune ${commune}`);
    return {
      codeEIC: '',
      raisonSociale: '',
    };
  }

  const gestionnaire = {
    codeEIC: parsedResult.results[0].grd_elec_eic,
    raisonSociale: parsedResult.results[0].grd_elec,
  };

  return gestionnaire;
};
