import { z } from 'zod';

import { Candidature } from '@potentiel-domain/projet';

import {
  optionalCsvDateSchema,
  optionalEnum,
  optionalOuiNonSchema,
  optionalOuiNonVideSchema,
  optionalStringWithDefaultValueSchema,
  ouiNonSchema,
  strictlyPositiveNumberSchema,
} from '../schemaBase';

export const puissanceALaPointeCsvSchema = optionalOuiNonSchema;
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
export const financementCollectifCsvSchema = ouiNonSchema;
export const gouvernancePartagéeCsvSchema = ouiNonSchema;
export const historiqueAbandonCsvSchema = z.enum(['1', '2', '3', '4']);
export const typeGarantiesFinancieresCsvSchema = optionalEnum(z.enum(['1', '2', '3']));
export const notifiedOnCsvSchema = z.undefined({
  invalid_type_error: 'Le champs notifiedOn ne peut pas être présent',
});
export const choixCoefficientKCsvSchema = optionalOuiNonVideSchema;

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

export const obligationDeSolarisationCsvSchema = optionalOuiNonVideSchema;
export const dateDAutorisationDUrbanismeCsvSchema = optionalCsvDateSchema.optional();
