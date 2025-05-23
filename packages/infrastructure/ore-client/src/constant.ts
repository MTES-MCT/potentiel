import zod from 'zod';

export const OreEndpoint = () => process.env.ORE_ENDPOINT || '';

export const OREApiLimitInString = '100';

export const référentielDistributeursDEnergieUrl =
  'api/explore/v2.1/catalog/datasets/referentiel-distributeurs-denergie/records?';

export const distributeurDEnergieParCommuneUrl =
  'api/explore/v2.1/catalog/datasets/distributeurs-denergie-par-commune/records?';

export const outreMerAndCorseCodePostal = [971, 972, 973, 974, 976, 20];

// API schema validators and types
export const gestionnaireSchema = zod.object({
  grd: zod.string(),
  eic: zod.string().nullable(),
  contact: zod.string().nullable(),
});

export const OREresultSchema = zod.object({
  total_count: zod.number(),
  results: zod.array(gestionnaireSchema),
});
