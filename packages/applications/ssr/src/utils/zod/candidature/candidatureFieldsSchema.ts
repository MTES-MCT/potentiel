import { z } from 'zod';

import { Candidature } from '@potentiel-domain/candidature';

import { getRégionAndDépartementFromCodePostal } from '../../../components/pages/candidature/helpers';

import {
  booleanSchema,
  dateSchema,
  numberSchema,
  optionalEnum,
  optionalOuiNonSchema,
  optionalStringSchema,
  ouiNonSchema,
  requiredStringSchema,
  strictlyPositiveNumberSchema,
} from './schemaBase';

export const appelOffreSchema = requiredStringSchema;
export const périodeSchema = requiredStringSchema;
export const familleSchema = requiredStringSchema;
export const numéroCRESchema = requiredStringSchema;
export const nomProjetSchema = requiredStringSchema;
export const sociétéMèreSchema = optionalStringSchema;
export const nomCandidatSchema = requiredStringSchema;
export const puissanceProductionAnnuelleSchema = strictlyPositiveNumberSchema;
export const prixReferenceSchema = strictlyPositiveNumberSchema;
export const noteTotaleSchema = numberSchema;
export const nomRepresentantLegalSchema = requiredStringSchema;
export const emailContactSchema = requiredStringSchema.email();
export const adresse1CsvSchema = optionalStringSchema;
export const adresse1Schema = requiredStringSchema;
export const adresse2Schema = optionalStringSchema;
export const codePostalSchema = requiredStringSchema
  .transform((val) => val.split('/').map((str) => str.trim()))
  .refine(
    (val) => val.every(getRégionAndDépartementFromCodePostal),
    'Le code postal ne correspond à aucune région / département',
  )
  .transform((val) => val.join(' / '));
export const communeSchema = requiredStringSchema;
export const doitRegenererAttestationSchema = booleanSchema.optional();
export const motifEliminationSchema = optionalStringSchema.transform((val) => val || undefined);
export const typeGarantiesFinancieresSchema = optionalEnum(
  z.enum(Candidature.TypeGarantiesFinancières.types),
);
export const typeGfSchema = z.enum(['1', '2', '3', '4']);
export const statutCsvSchema = z
  .string()
  .toLowerCase()
  .pipe(z.enum(['eliminé', 'éliminé', 'classé', 'retenu']));
// optionnel car une fois notifié, ce champs n'est plus modifiable
export const statutSchema = z.enum(Candidature.StatutCandidature.statuts).optional();
export const puissanceALaPointeSchema = booleanSchema;
export const puissanceALaPointeCsvSchema = optionalOuiNonSchema;
export const evaluationCarboneSimplifieeSchema = strictlyPositiveNumberSchema;
export const evaluationCarboneSimplifieeCsvSchema = z
  .union([z.literal('N/A'), z.literal(''), strictlyPositiveNumberSchema])
  .transform((val) => (val === 'N/A' || val === '' ? 0 : val));
export const actionnariatSchema = optionalEnum(z.enum(Candidature.TypeActionnariat.types));
export const technologieSchema = z.enum(Candidature.TypeTechnologie.types);
export const technologieCsvSchema = z
  .union([z.enum(['N/A', 'Eolien', 'Hydraulique', 'PV']), z.literal('')])
  .optional()
  .transform((val) => val || 'N/A');
export const dateEcheanceGfSchema = z
  .string()
  .transform((str) => (str ? new Date(str) : undefined))
  .optional();
export const dateEcheanceGfCsvSchema = dateSchema.optional();
export const financementCollectifCsvSchema = ouiNonSchema;
export const gouvernancePartagéeCsvSchema = ouiNonSchema;
export const historiqueAbandonCsvSchema = z.enum(['1', '2', '3', '4']);
