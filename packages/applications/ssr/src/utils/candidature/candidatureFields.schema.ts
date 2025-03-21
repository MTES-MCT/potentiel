import { z } from 'zod';

import { Candidature } from '@potentiel-domain/projet';

import { getRégionAndDépartementFromCodePostal } from '@/app/candidatures/_helpers';

import {
  booleanSchema,
  dateSchema,
  numberSchema,
  optionalEnum,
  optionalNumberSchema,
  optionalOuiNonSchema,
  optionalOuiNonVideSchema,
  optionalStringSchema,
  ouiNonSchema,
  requiredStringSchema,
  strictlyPositiveNumberSchema,
} from './schemaBase';

export const appelOffreSchema = requiredStringSchema;
export const périodeSchema = requiredStringSchema;
export const familleSchema = optionalStringSchema;
export const numéroCRESchema = requiredStringSchema;
export const nomProjetSchema = requiredStringSchema;
export const sociétéMèreSchema = optionalStringSchema;
export const nomCandidatSchema = requiredStringSchema;
export const puissanceProductionAnnuelleSchema = strictlyPositiveNumberSchema;
export const prixRéférenceSchema = strictlyPositiveNumberSchema;
export const noteTotaleSchema = numberSchema;
export const nomReprésentantLégalSchema = requiredStringSchema;
export const emailContactSchema = requiredStringSchema.email();
export const adresse1Schema = requiredStringSchema;
export const adresse2Schema = optionalStringSchema;

const normalizeStringArray = (value: string) =>
  value
    .split('/')
    .map((str) => str.trim())
    .filter((str) => !!str)
    .join(' / ');

export const codePostalSchema = requiredStringSchema
  .refine(
    (val) =>
      val
        .split('/')
        .map((str) => str.trim())
        .every(getRégionAndDépartementFromCodePostal),
    'Le code postal ne correspond à aucune région / département',
  )
  .transform(normalizeStringArray);

export const communeSchema = requiredStringSchema.transform(normalizeStringArray);
export const départementSchema = requiredStringSchema;
export const régionSchema = requiredStringSchema;
export const doitRegenererAttestationSchema = booleanSchema.optional();
export const motifEliminationSchema = optionalStringSchema.transform((val) => val || undefined);
export const typeGarantiesFinancieresSchema = optionalEnum(
  z.enum(Candidature.TypeGarantiesFinancières.types),
);
export const statutSchema = z.enum(Candidature.StatutCandidature.statuts);
export const puissanceALaPointeSchema = booleanSchema;
export const évaluationCarboneSimplifiéeSchema = strictlyPositiveNumberSchema;

export const actionnariatSchema = optionalEnum(z.enum(Candidature.TypeActionnariat.types));
export const technologieSchema = z.enum(Candidature.TypeTechnologie.types);
export const dateEchéanceOuDéliberationGfSchema = z
  .string()
  .transform((str) => (str ? new Date(str) : undefined))
  .optional();
export const territoireProjetSchema = optionalStringSchema;

export const choixCoefficientKSchema = booleanSchema.optional();

export const puissanceDeSiteSchema = optionalNumberSchema;

// champs spécifiques au Csv
export const puissanceALaPointeCsvSchema = optionalOuiNonSchema;
export const évaluationCarboneSimplifiéeCsvSchema = z
  .union([z.literal('N/A'), z.literal(''), strictlyPositiveNumberSchema])
  .transform((val) => (val === 'N/A' || val === '' ? 0 : val));
export const technologieCsvSchema = z
  .union([z.enum(['N/A', 'Eolien', 'Hydraulique', 'PV']), z.literal('')])
  .optional()
  .transform((val) => val || 'N/A');
export const statutCsvSchema = z
  .string()
  .toLowerCase()
  .pipe(z.enum(['eliminé', 'éliminé', 'classé', 'retenu']));

export const adresse1CsvSchema = optionalStringSchema;
export const dateEchéanceGfCsvSchema = dateSchema.optional();
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

export const élémentsSousOmbrièreCsvSchema = z.string().optional();
export const typologieDeBâtimentCsvSchema = optionalEnum(
  z.enum([
    'bâtiment neuf',
    'bâtiment existant avec rénovation de toiture',
    'bâtiment existant sans rénovation de toiture',
    'mixte',
  ]),
);
export const obligationDeSolarisationCsvSchema = optionalOuiNonVideSchema;
