import zod from 'zod';

import { OreGestionnaireByCity } from './récupérerGRDParVille';

export const OreEndpoint = process.env.ORE_ENDPOINT || '';

export const OREApiLimitInString = '100';

export const référentielDistributeursDEnergieUrl =
  'api/explore/v2.1/catalog/datasets/referentiel-distributeurs-denergie/records?';

export const distributeurDEnergieParCommuneUrl =
  'api/explore/v2.1/catalog/datasets/distributeurs-denergie-par-commune/records?';

export const outreMerAndCorseCodePostalToGRD: Record<string, OreGestionnaireByCity> = {
  971: {
    raisonSociale: 'EDF Archipel Guadeloupe',
    codeEIC: 'EDF Archipel Guadeloupe',
  },
  972: {
    raisonSociale: 'EDF Martinique',
    codeEIC: 'EDF Martinique',
  },
  973: {
    raisonSociale: 'EDF Guyane',
    codeEIC: 'EDF Guyane',
  },
  974: {
    raisonSociale: 'EDF Réunion',
    codeEIC: 'EDF Réunion',
  },
  976: {
    raisonSociale: 'Electricité de Mayotte',
    codeEIC: 'EDM976',
  },
  20: {
    raisonSociale: 'EDF Corse',
    codeEIC: 'EDF Corse',
  },
};

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
