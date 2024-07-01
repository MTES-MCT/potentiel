import zod from 'zod';

export const OreEndpoint = process.env.ORE_ENDPOINT || '';

export const OREApiLimitInString = '100';

export const référentielDistributeursDEnergieUrl =
  'api/explore/v2.1/catalog/datasets/referentiel-distributeurs-denergie/records?';

export const distributeurDEnergieParCommuneUrl =
  'api/explore/v2.1/catalog/datasets/distributeurs-denergie-par-commune/records?';

export const relevantDOMTOM = ['Guadeloupe', 'Martinique', 'Guyane', 'LaRéunion', 'Mayotte'];
export type RelevantDOMTOM = (typeof relevantDOMTOM)[number];

export const DOMTOMPostalCodeRanges: Record<RelevantDOMTOM, { min: number; max: number }> = {
  Guadeloupe: { min: 97100, max: 97199 },
  Martinique: { min: 97200, max: 97299 },
  Guyane: { min: 97300, max: 97399 },
  LaRéunion: { min: 97400, max: 97499 },
  Mayotte: { min: 97600, max: 97699 },
};

export const DOMTOMNameToGRDRaisonSociale: Record<RelevantDOMTOM, string> = {
  Guadeloupe: 'EDF Archipel Guadeloupe',
  Martinique: 'EDF Martinique',
  Guyane: 'EDF Guyane',
  LaRéunion: 'EDF Réunion',
  Mayotte: 'Electricité de Mayotte',
};

export const MayotteGRDEIC = 'EDM976';

export const gestionnaireSchema = zod.object({
  grd: zod.string(),
  eic: zod.string().nullable(),
  contact: zod.string().nullable(),
});

export const OREresultSchema = zod.object({
  total_count: zod.number(),
  results: zod.array(gestionnaireSchema),
});

export type OreGestionnaire = Omit<zod.TypeOf<typeof gestionnaireSchema>, 'eic'> & {
  eic: string;
};
