import { get } from '@potentiel-libraries/http-client';
import zod from 'zod';

import { OreEndpoint } from './constant';
import { GestionnaireRéseau as Gestionnaire } from '@potentiel-domain/reseau';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';
import { transformCommuneToOreFormat } from './helper/transformCommuneToOreFormat';

const schema = zod.object({
  total_count: zod.number(),
  results: zod.array(
    zod.object({
      grd_elec: zod.array(zod.string()).nullable(),
      grd_elec_eic: zod.array(zod.string()).nullable(),
      commune: zod.string(),
    }),
  ),
});

type GetGRDByCityProps = {
  codePostal: string;
  commune: string;
};

export type OreGestionnaireByCity = Pick<
  Gestionnaire.GestionnaireRéseauEntity,
  'raisonSociale' | 'codeEIC'
>;

const logger = getLogger();

export const getGRDByCity = async ({
  codePostal,
  commune,
}: GetGRDByCityProps): Promise<Option.Type<OreGestionnaireByCity>> => {
  const oreFormatCommune = transformCommuneToOreFormat(commune);
  const searchParams = new URLSearchParams();
  searchParams.append(
    'where',
    `code_postal in ("${codePostal}") and commune like "${oreFormatCommune}"`,
  );
  searchParams.append('select', 'grd_elec, grd_elec_eic, commune');
  // this is enough to check our conditions below
  searchParams.append('limit', '2');

  const url = new URL(
    `${OreEndpoint}/distributeurs-denergie-par-commune/records?${searchParams.toString()}`,
  );

  try {
    const result = await get(url);

    const parsedResult = schema.parse(result);

    if (parsedResult.total_count === 0) {
      logger.warn(
        `Aucun GRD trouvé pour le code postal ${codePostal} et la commune ${oreFormatCommune}`,
      );
      return Option.none;
    }

    if (
      !parsedResult.results[0].grd_elec_eic ||
      parsedResult.results[0].grd_elec_eic.length === 0
    ) {
      logger.warn(
        `Un GRD (${parsedResult.results[0].grd_elec}) a été trouvé mais sans code EIC pour le code postal ${codePostal} et la commune ${oreFormatCommune}`,
      );

      return Option.none;
    }

    if (!parsedResult.results[0].grd_elec || parsedResult.results[0].grd_elec.length === 0) {
      logger.warn(
        `Un GRD a été trouvé avec code EIC (${parsedResult.results[0].grd_elec_eic}) mais sans raison social pour le code postal ${codePostal} et la commune ${oreFormatCommune}`,
      );
      return Option.none;
    }

    if (parsedResult.results[0].grd_elec_eic.length > 1) {
      logger.warn(
        `Un GRD (${
          parsedResult.results[0].grd_elec
        }) a été trouvé avec plusieurs code EIC (${parsedResult.results[0].grd_elec_eic.join(
          '/',
        )}) pour le code postal ${codePostal} et la commune ${oreFormatCommune}`,
      );

      return Option.none;
    }

    logger.info(
      `GRD ${parsedResult.results[0].grd_elec[0]} trouvé pour le code postal ${codePostal} et la commune ${oreFormatCommune}`,
    );

    return {
      codeEIC: parsedResult.results[0].grd_elec_eic[0],
      raisonSociale: parsedResult.results[0].grd_elec[0],
    };
  } catch (error) {
    logger.error(error as Error);

    return Option.none;
  }
};
