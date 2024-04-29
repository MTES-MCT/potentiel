import { get } from '@potentiel-libraries/http-client';
import { GestionnaireRéseau as Gestionnaire } from '@potentiel-domain/reseau';
import zod from 'zod';

const getOreEndpoint = () => process.env.ORE_ENDPOINT || '';

const schema = zod.object({
  total_count: zod.number(),
  results: zod.array(
    zod.object({
      grd: zod.string(),
      eic: zod.string(),
    }),
  ),
});

type Gestionnaire = Pick<Gestionnaire.GestionnaireRéseauEntity, 'raisonSociale' | 'codeEIC'>;

export const getAllGRDs = async (): Promise<Array<Gestionnaire>> => {
  const searchParams = new URLSearchParams();
  searchParams.append('where', 'energie:"Électricité"');
  searchParams.append('select', 'grd,eic');

  const url = new URL(
    `${getOreEndpoint()}/api/explore/v2.1/catalog/datasets/referentiel-distributeurs-denergie/records?${searchParams.toString()}`,
  );

  const result = await get(url);

  const gestionnaires = schema.parse(result);

  return gestionnaires.results.map(({ eic, grd }) => ({
    codeEIC: eic,
    raisonSociale: grd,
  }));
};
