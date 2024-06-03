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
      grd_elec: zod.array(zod.string()),
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

export const récupérerGRDParVille = async ({
  codePostal,
  commune,
}: GetGRDByCityProps): Promise<Option.Type<OreGestionnaireByCity>> => {
  const oreFormatCommune = transformCommuneToOreFormat(commune);
  const searchParams = new URLSearchParams();
  searchParams.append(
    'where',
    `code_postal in ("${codePostal}") and commune like "${oreFormatCommune}" and grd_elec is not null`,
  );
  searchParams.append('select', 'grd_elec, grd_elec_eic, commune');
  /**
   * Il nous faut seulement vérifier si nous obtenons au moins un ou plusieurs résultats
   */
  searchParams.append('limit', '2');

  const url = new URL(
    `${OreEndpoint}api/explore/v2.1/catalog/datasets/distributeurs-denergie-par-commune/records?${searchParams.toString()}`,
  );

  try {
    const result = await get(url);

    const parsedResult = schema.parse(result);

    if (parsedResult.total_count === 0) {
      logger.warn(
        `[récupérerGRDParVille] Aucun GRD trouvé pour le code postal ${codePostal} et la commune ${oreFormatCommune}`,
      );
      return Option.none;
    }

    if (
      (!parsedResult.results[0].grd_elec_eic ||
        parsedResult.results[0].grd_elec_eic.length === 0) &&
      (!parsedResult.results[0].grd_elec || parsedResult.results[0].grd_elec.length === 0)
    ) {
      logger.warn(
        `[récupérerGRDParVille] Un GRD (${parsedResult.results[0].grd_elec}) a été trouvé mais sans code EIC et sans raison sociale pour le code postal ${codePostal} et la commune ${oreFormatCommune}`,
      );
      return Option.none;
    }

    if (parsedResult.results[0].grd_elec_eic && parsedResult.results[0].grd_elec_eic.length > 1) {
      logger.warn(
        `[récupérerGRDParVille] Un GRD (${
          parsedResult.results[0].grd_elec
        }) a été trouvé avec plusieurs code EIC (${parsedResult.results[0].grd_elec_eic.join(
          '/',
        )}) pour le code postal ${codePostal} et la commune ${oreFormatCommune}`,
      );
      return Option.none;
    }

    /**
     * Règle métier : quand aucun code EIC n'est fourni, on utilise la raison sociale (ou grd)
     */
    const codeEIC =
      parsedResult.results[0].grd_elec_eic?.[0] ?? parsedResult.results[0].grd_elec[0];

    logger.info(codeEIC);

    return {
      codeEIC,
      raisonSociale: parsedResult.results[0].grd_elec[0],
    };
  } catch (error) {
    logger.error(error as Error);

    return Option.none;
  }
};
