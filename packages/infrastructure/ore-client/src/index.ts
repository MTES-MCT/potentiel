import { GestionnaireRéseau as Gestionnaire } from '@potentiel-domain/reseau';
import { get } from '@potentiel-libraries/http-client';
import zod from 'zod';

const OreEndpoint = process.env.ORE_ENDPOINT || '';

const ORE_API_LIMIT_IN_STRING = '100';

const schema = zod.object({
  total_count: zod.number(),
  results: zod.array(
    zod.object({
      grd: zod.string(),
      eic: zod.string(),
      telephone: zod.string().nullable(),
      contact: zod.string().nullable(),
    }),
  ),
});

export type OreGestionnaire = Pick<
  Gestionnaire.GestionnaireRéseauEntity,
  'raisonSociale' | 'codeEIC' | 'contactInformations'
>;

type OreGestionnaireSlice = {
  gestionnaires: Array<OreGestionnaire>;
  totalCount: number;
};

const getGRDsSlice = async (offset: string): Promise<OreGestionnaireSlice> => {
  const searchParams = new URLSearchParams();
  searchParams.append('where', 'energie:"Électricité" and eic is not null and grd is not null');
  searchParams.append('select', 'grd, eic, contact, telephone');
  searchParams.append('limit', ORE_API_LIMIT_IN_STRING);
  searchParams.append('offset', offset);

  const url = new URL(
    `${OreEndpoint}/api/explore/v2.1/catalog/datasets/referentiel-distributeurs-denergie/records?${searchParams.toString()}`,
  );

  const result = await get(url);

  const parsedResult = schema.parse(result);

  return {
    gestionnaires: parsedResult.results.map(({ eic, grd, telephone, contact }) => ({
      codeEIC: eic,
      raisonSociale: grd,
      contactInformations: {
        ...(telephone && { phone: telephone }),
        ...(contact && { email: contact }),
      },
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
