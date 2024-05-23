import { get } from '@potentiel-libraries/http-client';
import zod from 'zod';

import { OreEndpoint } from './constant';
import { getLogger } from '@potentiel-libraries/monitoring';
import { GestionnaireRéseau as Gestionnaire } from '@potentiel-domain/reseau';

const schema = zod.object({
  total_count: zod.number(),
  results: zod.array(
    zod.object({
      grd_elec: zod.array(zod.string()),
      grd_elec_eic: zod.array(zod.string()),
    }),
  ),
});

type Params = {
  codePostal: string;
  commune: string;
};

export type OreGestionnaireByCity = Pick<
  Gestionnaire.GestionnaireRéseauEntity,
  'raisonSociale' | 'codeEIC'
>;

const transformCommuneString = (commune: string) =>
  commune.replace(/(?:^|[^a-zA-Z])([a-z])/g, (match, p1) => match.slice(0, -1) + p1.toUpperCase());

export const getGRDByCity = async ({
  codePostal,
  commune,
}: Params): Promise<OreGestionnaireByCity | undefined> => {
  const searchParams = new URLSearchParams();
  searchParams.append(
    'where',
    `code_postal:"${codePostal}" and commune:"${transformCommuneString(
      commune,
    )}" and grd_elec is not null and grd_elec_eic is not null`,
  );
  searchParams.append('select', 'grd_elec, grd_elec_eic');
  searchParams.append('limit', '1');

  const url = new URL(
    `${OreEndpoint}/distributeurs-denergie-par-commune/records?${searchParams.toString()}`,
  );

  try {
    const result = await get(url);

    const parsedResult = schema.parse(result);
    let count = 0;
    if (parsedResult.total_count > 1) {
      count += 1;
      console.log(
        `🤡 More than one result for communde : ${commune} and postal code ${codePostal}`,
      );
      console.log(parsedResult.results);
    }

    if (parsedResult.total_count === 0) {
      getLogger().warn(`No GRD could be found for codePostal ${codePostal} and commune ${commune}`);
      return {
        codeEIC: '',
        raisonSociale: '',
      };
    }

    // if (
    //   (!parsedResult.results[0].grd_elec || parsedResult.results[0].grd_elec.length === 0) &&
    //   (!parsedResult.results[0].grd_elec_eic || parsedResult.results[0].grd_elec_eic.length === 0)
    // ) {
    //   getLogger().warn(`No GRD could be found for codePostal ${codePostal} and commune ${commune}`);
    //   return {
    //     codeEIC: '',
    //     raisonSociale: '',
    //   };
    // }

    const gestionnaire = {
      codeEIC: parsedResult.results[0].grd_elec_eic[0] ?? '',
      raisonSociale: parsedResult.results[0].grd_elec[0] ?? '',
    };

    return gestionnaire;
  } catch (error) {
    getLogger().error(error as Error);
  }
};
