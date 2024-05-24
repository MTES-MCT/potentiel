import { get } from '@potentiel-libraries/http-client';
import zod from 'zod';

import { OreEndpoint } from './constant';
import { GestionnaireRéseau as Gestionnaire } from '@potentiel-domain/reseau';

const schema = zod.object({
  total_count: zod.number(),
  results: zod.array(
    zod.object({
      grd_elec: zod.array(zod.string()),
      grd_elec_eic: zod.array(zod.string()),
      commune: zod.string(),
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

const transformCommuneString = (commune: string) => {
  return commune
    .toLowerCase()
    .replace(/(?:^|[^a-zA-Z])([a-z])/g, (match, p1, offset) => {
      if (offset === 0) {
        return p1.toUpperCase();
      }
      return match.slice(0, -1) + match.charAt(match.length - 1).toUpperCase();
    })
    .replace(/\d/g, '')
    .replace('St ', 'Saint ')
    .replace('Ste ', 'Sainte ')
    .replace(' St ', ' Saint ')
    .replace(' Ste ', ' Sainte ')
    .replace('D ', "D'")
    .replace('L ', "L'")
    .trim();
};

export const getGRDByCity = async ({
  codePostal,
  commune,
}: Params): Promise<{ gestionnaire: OreGestionnaireByCity | undefined }> => {
  const searchParams = new URLSearchParams();
  searchParams.append(
    'where',
    `code_postal in ("${codePostal}") and commune like "${transformCommuneString(
      commune,
    )}" and grd_elec is not null and grd_elec_eic is not null`,
  );
  searchParams.append('select', 'grd_elec, grd_elec_eic, commune');
  searchParams.append('limit', '2');

  const url = new URL(
    `${OreEndpoint}/distributeurs-denergie-par-commune/records?${searchParams.toString()}`,
  );

  try {
    const result = await get(url);

    const parsedResult = schema.parse(result);

    if (parsedResult.total_count === 0) {
      // getLogger().warn(
      //   `No GRD could be found for codePostal ${codePostal} and commune ${transformCommuneString(
      //     commune,
      //   )}`,
      // );

      console.log(
        `No GRD could be found for codePostal ${codePostal} and commune ${transformCommuneString(
          commune,
        )}`,
      );

      return {
        gestionnaire: undefined,
      };
    }

    if (parsedResult.total_count > 1) {
      // console.log(
      //   `🤡 More than one commune found for commune : ${transformCommuneString(
      //     commune,
      //   )} and postal code ${codePostal}`,
      // );
      // console.log(parsedResult.results[0].commune, transformCommuneString(commune));
      // getLogger().info(
      //   `${
      //     parsedResult.total_count
      //   } communes could be found for codePostal ${codePostal} and commune ${transformCommuneString(
      //     commune,
      //   )}`,
      // );

      if (parsedResult.results[0].grd_elec_eic.length === 0) {
        // console.log(
        //   `${
        //     parsedResult.total_count
        //   } communes could be found for codePostal ${codePostal} and commune ${transformCommuneString(
        //     commune,
        //   )} but problem with ${parsedResult.results[0]}`,
        // );

        return {
          gestionnaire: undefined,
        };
      }

      return {
        gestionnaire: {
          codeEIC: parsedResult.results[0].grd_elec_eic[0],
          raisonSociale: parsedResult.results[0].grd_elec[0],
        },
      };
    }

    if (parsedResult.results[0].grd_elec_eic.length === 0) {
      // console.log(
      //   `1 commune found for ${codePostal} and commune ${transformCommuneString(
      //     commune,
      //   )} but grd elec eic is null : ${parsedResult.results[0]}}`,
      // );

      return {
        gestionnaire: undefined,
      };
    }

    const gestionnaire = {
      codeEIC: parsedResult.results[0].grd_elec_eic[0],
      raisonSociale: parsedResult.results[0].grd_elec[0],
    };

    return {
      gestionnaire,
    };
  } catch (error) {
    console.error(error);
    return {
      gestionnaire: undefined,
    };
    // getLogger().error(error as Error);
  }
};
