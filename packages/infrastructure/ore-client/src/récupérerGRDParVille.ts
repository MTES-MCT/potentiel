import zod from 'zod';

import { GestionnaireRéseau as Gestionnaire } from '@potentiel-domain/reseau';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';
import { get } from '@potentiel-libraries/http-client';

import { OreEndpoint, distributeurDEnergieParCommuneUrl } from './constant.js';
import { normaliserCommune } from './helper/normaliserCommune.js';
import { isZNI } from './helper/isZNI.js';

type GetGRDByCityProps = {
  codePostal: string;
  commune: string;
};

export type OreGestionnaireByCity = Pick<
  Gestionnaire.GestionnaireRéseauEntity,
  'raisonSociale' | 'codeEIC'
>;

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

const logger = getLogger();

export const récupérerGRDParVille = async ({
  codePostal,
  commune,
}: GetGRDByCityProps): Promise<Option.Type<OreGestionnaireByCity>> => {
  const url = new URL(distributeurDEnergieParCommuneUrl, OreEndpoint());

  url.searchParams.append('where', `code_postal="${codePostal}" and grd_elec is not null`);
  url.searchParams.append('select', 'grd_elec, grd_elec_eic, commune');
  /**
   * Un code postal peut correspondre à une cinquantaine de villes max (cf 51300)
   */
  url.searchParams.append('limit', '50');

  try {
    if (isZNI(codePostal)) {
      return {
        codeEIC: '23X160203-000021',
        raisonSociale: 'SEI',
      };
    }

    const result = await get({ url });

    const parsedResult = schema.parse(result);

    if (parsedResult.total_count === 0) {
      logger.warn(`[récupérerGRDParVille] Aucun GRD trouvé pour le code postal ${codePostal}`);
      return Option.none;
    }

    const communeNormalisée = normaliserCommune(commune);
    const communesTrouvées = parsedResult.results.filter(
      (ore) => normaliserCommune(ore.commune) === communeNormalisée,
    );

    if (communesTrouvées.length === 0) {
      logger.warn(
        `[récupérerGRDParVille] Aucune commune trouvée dans la base ORE pour le code postal ${codePostal} et la commune ${communeNormalisée}`,
      );
      return Option.none;
    }
    if (communesTrouvées.length > 1) {
      logger.warn(
        `[récupérerGRDParVille] Plus d'une commune trouvée dans la base ORE pour le code postal ${codePostal} et la commune ${communeNormalisée}`,
      );
      return Option.none;
    }
    const communeTrouvée = communesTrouvées[0];

    if (
      (!communeTrouvée.grd_elec_eic || communeTrouvée.grd_elec_eic.length === 0) &&
      (!communeTrouvée.grd_elec || communeTrouvée.grd_elec.length === 0)
    ) {
      logger.warn(
        `[récupérerGRDParVille] Un GRD (${communeTrouvée.grd_elec}) a été trouvé mais sans code EIC et sans raison sociale pour le code postal ${codePostal} et la commune ${communeNormalisée}`,
      );
      return Option.none;
    }

    if (communeTrouvée.grd_elec_eic && communeTrouvée.grd_elec_eic.length > 1) {
      logger.warn(
        `[récupérerGRDParVille] Un GRD (${
          communeTrouvée.grd_elec
        }) a été trouvé avec plusieurs code EIC (${communeTrouvée.grd_elec_eic.join(
          '/',
        )}) pour le code postal ${codePostal} et la commune ${communeNormalisée}`,
      );
      return Option.none;
    }

    /**
     * Règle métier : quand aucun code EIC n'est fourni, on utilise la raison sociale (ou grd)
     */
    const codeEIC = communeTrouvée.grd_elec_eic?.[0] ?? communeTrouvée.grd_elec[0];

    return {
      codeEIC,
      raisonSociale: communeTrouvée.grd_elec[0],
    };
  } catch (error) {
    logger.error(error as Error);

    return Option.none;
  }
};
