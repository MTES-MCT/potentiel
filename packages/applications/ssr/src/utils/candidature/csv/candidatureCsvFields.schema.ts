import { z } from 'zod';

import { Candidature } from '@potentiel-domain/projet';
import { récupérerDépartementRégionParCodePostal } from '@potentiel-domain/inmemory-referential';

import {
  optionalEnum,
  optionalStringWithDefaultValueSchema,
  ouiNonSchema,
  strictlyPositiveNumberSchema,
  stringToArray,
} from '../schemaBase';

import { optionalCsvDateSchema } from './commonCsv.schema';

/** Retourne undefined en l'absence de valeur */
export const _optionalOuiNonVideSchema = z
  .string()
  .optional()
  .transform((val) => val?.trim() || undefined)
  .pipe(ouiNonSchema.optional());

/** Retourne false en l'absence de valeur */
export const _optionalOuiNonSchema = z
  .string()
  .optional()
  .transform((val) => val?.trim() || 'false')
  .pipe(ouiNonSchema);

export const puissanceALaPointeCsvSchema = _optionalOuiNonSchema;
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
export const financementCollectifCsvSchema = _optionalOuiNonVideSchema;
export const gouvernancePartagéeCsvSchema = _optionalOuiNonVideSchema;
export const historiqueAbandonCsvSchema = z.enum(['1', '2', '3', '4']);

export const typeGarantiesFinancieresCsvSchema = optionalEnum(z.enum(['1', '2', '3']));
export const notifiedOnCsvSchema = z.undefined({
  error: 'Le champs notifiedOn ne peut pas être présent',
});
export const choixCoefficientKCsvSchema = _optionalOuiNonVideSchema;

export const installationsAgrivoltaiquesCsvSchema = optionalEnum(
  z.enum(['culture', 'jachère de plus de 5 ans', 'élevage', 'serre']),
);
export type InstallationsAgrivoltaiquesCsvShape = z.infer<
  typeof installationsAgrivoltaiquesCsvSchema
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

export const obligationDeSolarisationCsvSchema = _optionalOuiNonVideSchema;
export const dateDAutorisationDUrbanismeCsvSchema = optionalCsvDateSchema.optional();
export const installationAvecDispositifDeStockageCsvSchema = _optionalOuiNonVideSchema;

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
