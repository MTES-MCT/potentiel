import { GestionnaireRéseau as Gestionnaire } from '@potentiel-domain/reseau';
import { get } from '@potentiel-libraries/http-client';
import zod from 'zod';
import { ORE_API_LIMIT_IN_STRING, OreEndpoint } from './constant';

const schema = zod.object({
  total_count: zod.number(),
  results: zod.array(
    zod.object({
      grd: zod.string(),
      eic: zod.string(),
      contact: zod.string().nullable(),
    }),
  ),
});

export type OreGestionnaire = Pick<
  Gestionnaire.GestionnaireRéseauEntity,
  'raisonSociale' | 'codeEIC' | 'contactEmail'
>;

type OreGestionnaireSlice = {
  gestionnaires: Array<OreGestionnaire>;
  totalCount: number;
};

const getGRDsSlice = async (offset: string): Promise<OreGestionnaireSlice> => {
  const searchParams = new URLSearchParams();
  searchParams.append('where', 'grd:"Enedis"');
  searchParams.append('select', 'grd, eic, contact');
  searchParams.append('limit', ORE_API_LIMIT_IN_STRING);
  searchParams.append('offset', offset);

  const url = new URL(
    `${OreEndpoint}/referentiel-distributeurs-denergie/records?${searchParams.toString()}`,
  );

  const result = await get(url);

  const parsedResult = schema.parse(result);

  return {
    gestionnaires: parsedResult.results.map(({ eic, grd, contact }) => ({
      codeEIC: eic,
      raisonSociale: grd,
      contactEmail: contact ?? '',
    })),
    totalCount: parsedResult.total_count,
  };
};

export const getAllGRDs = async (
  offset: number = 0,
  gestionnaires: Array<OreGestionnaire> = [],
): Promise<Array<OreGestionnaire>> => {
  const gestionnaireSlice = await getGRDsSlice(offset.toString());
  const updatedGestionnaires = gestionnaires.concat(gestionnaireSlice.gestionnaires);

  if (updatedGestionnaires.length < gestionnaireSlice.totalCount) {
    return getAllGRDs(offset + gestionnaireSlice.gestionnaires.length, updatedGestionnaires);
  }

  return updatedGestionnaires;
};
