import { z } from 'zod';

import { Candidature } from '@potentiel-domain/projet';
import { récupérerDépartementRégionParCodePostal } from '@potentiel-domain/inmemory-referential';

import {
  optionalEnum,
  optionalStrictlyPositiveNumberSchema,
  optionalStringWithDefaultValueSchema,
  strictlyPositiveNumberSchema,
  stringToArray,
} from '../schemaBase';

import { optionalCsvDateSchema, optionalOuiNonVideSchema } from './commonCsv.schema';

export const puissanceALaPointeCsvSchema = optionalOuiNonVideSchema.default(false);
export const évaluationCarboneSimplifiéeCsvSchema = z
  .union([z.literal('N/A'), z.literal(''), strictlyPositiveNumberSchema])
  .transform((val) => (val === 'N/A' || val === '' ? 0 : val));
export const technologieCsvSchema = z
  .union([z.enum(['N/A', 'Eolien', 'Hydraulique', 'PV']), z.literal('')])
  .optional()
  .transform((val) => val || 'N/A');

const statut = {
  éliminé: 'éliminé',
  eliminé: 'éliminé',
  classé: 'classé',
  retenu: 'classé',
} satisfies Record<string, Candidature.StatutCandidature.RawType>;

export const statutCsvSchema = z
  .string()
  .toLowerCase()
  .pipe(z.enum(['eliminé', 'éliminé', 'classé', 'retenu']))
  .transform((val) => statut[val]);

export const adresse1CsvSchema = optionalStringWithDefaultValueSchema;
export const dateEchéanceGfCsvSchema = optionalCsvDateSchema.optional();
export const financementCollectifCsvSchema = optionalOuiNonVideSchema;
export const gouvernancePartagéeCsvSchema = optionalOuiNonVideSchema;
export const historiqueAbandonCsvSchema = z.enum(['1', '2', '3', '4']);

export const typeGarantiesFinancieresCsvSchema = optionalEnum(z.enum(['1', '2', '3']));
export const notifiedOnCsvSchema = z.undefined({
  error: 'Le champs notifiedOn ne peut pas être présent',
});
export const choixCoefficientKCsvSchema = optionalOuiNonVideSchema;

export const installationsAgrivoltaïquesCsvSchema = optionalEnum(
  z.enum(['culture', 'jachère de plus de 5 ans', 'élevage', 'serre']),
);
export type InstallationsAgrivoltaïquesCsvShape = z.infer<
  typeof installationsAgrivoltaïquesCsvSchema
>;

export const élémentsSousOmbrièreCsvSchema = z.string().optional();
export type ÉlémentsSousOmbrièreCsvShape = z.infer<typeof élémentsSousOmbrièreCsvSchema>;

export const typologieDeBâtimentCsvSchema = optionalEnum(
  z.enum([
    'bâtiment neuf',
    'bâtiment existant avec rénovation de toiture',
    'bâtiment existant sans rénovation de toiture',
    'mixte',
  ]),
);
export type TypologieBâtimentCsvShape = z.infer<typeof typologieDeBâtimentCsvSchema>;

export const obligationDeSolarisationCsvSchema = optionalOuiNonVideSchema;
export const dateDAutorisationDUrbanismeOuEnvironnementaleCsvSchema =
  optionalCsvDateSchema.optional();
export const installationAvecDispositifDeStockageCsvSchema = optionalOuiNonVideSchema;
export const puissanceDuDispositifDeStockageSchema = optionalStrictlyPositiveNumberSchema;
export const capacitéDuDispositifDeStockageSchema = optionalStrictlyPositiveNumberSchema;

// On accepte :
// - de multiples code postaux séparés par /
// - un code postal unique à 4 chiffres, qui sera complété par un 0 devant (car excel retire les 0 du début)
export const codePostalCsvSchema = z
  .string()
  .transform((val) => stringToArray(val, '/').map((val) => val.padStart(5, '0')))
  .refine((val) => val.length > 0, 'Le code postal est requis')
  .refine(
    (val) => !val || val.every(récupérerDépartementRégionParCodePostal),
    'Le code postal ne correspond à aucune région / département',
  )
  .transform((val) => val.join(' / '));

export const natureDeLExploitationCsvSchema = z
  .union([
    z.enum(['Vente avec injection du surplus', 'Vente avec injection en totalité']),
    z.literal(''),
  ])
  .optional()
  .transform((val) => val || undefined);

export const territoireProjetSchema = optionalStringWithDefaultValueSchema;
