import { get } from '@potentiel-libraries/http-client';
import zod from 'zod';
import { OREApiLimitInString, OreEndpoint } from './constant';

const schema = zod.object({
  total_count: zod.number(),
  results: zod.array(
    zod.object({
      grd: zod.string(),
      eic: zod.string().nullable(),
      contact: zod.string().nullable(),
    }),
  ),
});

export type OreGestionnaire = zod.TypeOf<typeof schema>['results'][number];

type OreGestionnaireSlice = {
  gestionnaires: Array<OreGestionnaire>;
  totalCount: number;
};

const récupérerGRDParTranche = async (offset: string): Promise<OreGestionnaireSlice> => {
  const searchParams = new URLSearchParams();
  searchParams.append('where', 'energie:"Électricité" and grd is not null');
  searchParams.append('select', 'grd, eic, contact');

  searchParams.append('limit', OREApiLimitInString);
  searchParams.append('offset', offset);

  const url = new URL(
    `${OreEndpoint}/referentiel-distributeurs-denergie/records?${searchParams.toString()}`,
  );

  const result = await get(url);

  const parsedResult = schema.parse(result);

  return {
    totalCount: parsedResult.total_count,
    gestionnaires: parsedResult.results,
  };
};

export const récupérerToutLesGRD = async (
  offset: number = 0,
  gestionnaires: Array<OreGestionnaire> = [],
): Promise<Array<OreGestionnaire>> => {
  const gestionnaireSlice = await récupérerGRDParTranche(offset.toString());
  const updatedGestionnaires = gestionnaires.concat(gestionnaireSlice.gestionnaires);

  if (updatedGestionnaires.length < gestionnaireSlice.totalCount) {
    return récupérerToutLesGRD(
      offset + gestionnaireSlice.gestionnaires.length,
      updatedGestionnaires,
    );
  }

  return updatedGestionnaires;
};
