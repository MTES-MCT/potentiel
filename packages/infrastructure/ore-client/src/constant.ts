import zod from 'zod';

export const OreEndpoint = process.env.ORE_ENDPOINT || '';

export const OREApiLimitInString = '100';

export const référentielDistributeursDEnergieUrl =
  'api/explore/v2.1/catalog/datasets/referentiel-distributeurs-denergie/records?';

export const distributeurDEnergieParCommuneUrl =
  'api/explore/v2.1/catalog/datasets/distributeurs-denergie-par-commune/records?';

// constants relevant to Outre-mer
export const relevantOutreMer = ['Guadeloupe', 'Martinique', 'Guyane', 'LaRéunion', 'Mayotte'];
export type RelevantOutreMer = (typeof relevantOutreMer)[number];

export const outreMerPostalCodePrefixInString: Record<string, RelevantOutreMer> = {
  971: 'Guadeloupe',
  972: 'Martinique',
  973: 'Guyane',
  974: 'LaRéunion',
  976: 'Mayotte',
};

export const outreMerNameToGRDRaisonSociale: Record<RelevantOutreMer, string> = {
  Guadeloupe: 'EDF Archipel Guadeloupe',
  Martinique: 'EDF Martinique',
  Guyane: 'EDF Guyane',
  LaRéunion: 'EDF Réunion',
  Mayotte: 'Electricité de Mayotte',
};

export const MayotteGRDEIC = 'EDM976';

// constants relevant to Corsica
export const CorsePostalCodePrefixInString = '20';
export const corseGRDRaisonSociale = 'EDF Corse';

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

export type OreGestionnaire = Omit<zod.TypeOf<typeof gestionnaireSchema>, 'eic'> & {
  eic: string;
};
