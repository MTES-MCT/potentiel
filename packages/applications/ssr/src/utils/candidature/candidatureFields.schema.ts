import { z } from 'zod';

import { Candidature, Lauréat } from '@potentiel-domain/projet';
import { récupérerDépartementRégionParCodePostal } from '@potentiel-domain/inmemory-referential';

import {
  booleanSchema,
  numberSchema,
  optionalDateSchema,
  optionalEnum,
  optionalEnumForCorrection,
  optionalNumberSchema,
  optionalStringSchema,
  optionalStringWithDefaultValueSchema,
  requiredStringSchema,
  strictlyPositiveNumberSchema,
  stringToArray,
} from './schemaBase';

export const identifiantProjetSchema = requiredStringSchema;

export const appelOffreSchema = requiredStringSchema;
export const périodeSchema = requiredStringSchema;
export const familleSchema = optionalStringWithDefaultValueSchema;
export const numéroCRESchema = requiredStringSchema;
export const nomProjetSchema = requiredStringSchema;
export const sociétéMèreSchema = optionalStringWithDefaultValueSchema;
export const nomCandidatSchema = requiredStringSchema;
export const puissanceProductionAnnuelleSchema = strictlyPositiveNumberSchema;
export const prixRéférenceSchema = strictlyPositiveNumberSchema;
export const noteTotaleSchema = numberSchema;
export const nomReprésentantLégalSchema = requiredStringSchema;
export const emailContactSchema = requiredStringSchema.pipe(z.email());
export const adresse1Schema = requiredStringSchema;
export const adresse2Schema = optionalStringSchema;

// On accepte de multiples code postaux séparés par /
export const codePostalSchema = requiredStringSchema
  .transform((val) => stringToArray(val, '/'))
  .refine((val) => val.length > 0, 'Le code postal est requis')
  .refine(
    (val) => val.every(récupérerDépartementRégionParCodePostal),
    'Le code postal ne correspond à aucune région / département',
  )
  .transform((val) => val.join(' / '));

export const communeSchema = requiredStringSchema.transform((val) =>
  stringToArray(val, '/').join(' / '),
);
export const départementSchema = requiredStringSchema;
export const régionSchema = requiredStringSchema;
export const doitRegenererAttestationSchema = booleanSchema.optional();
export const motifEliminationSchema = optionalStringSchema;
export const typeGarantiesFinancieresSchema = optionalEnum(
  z.enum(Candidature.TypeGarantiesFinancières.types),
);
export const statutSchema = z.enum(Candidature.StatutCandidature.statuts);
export const puissanceALaPointeSchema = booleanSchema.optional().default(false);
export const évaluationCarboneSimplifiéeSchema = strictlyPositiveNumberSchema;

export const actionnariatSchema = optionalEnum(z.enum(Candidature.TypeActionnariat.types));
export const actionnariatCorrigerCandidatureSchema = optionalEnumForCorrection(
  z.enum(Candidature.TypeActionnariat.types),
);

export const historiqueAbandonSchema = z.enum(Candidature.HistoriqueAbandon.types);
export const technologieSchema = z.enum(Candidature.TypeTechnologie.types);
export const dateEchéanceOuDéliberationGfSchema = optionalDateSchema;
export const territoireProjetSchema = optionalStringWithDefaultValueSchema;

export const choixCoefficientKSchema = booleanSchema.optional();
export const obligationDeSolarisationSchema = booleanSchema.optional();

export const puissanceDeSiteSchema = optionalNumberSchema;

export const dateDAutorisationDUrbanismeSchema = optionalDateSchema;
export const numéroDAutorisationDUrbanismeSchema = optionalStringSchema;

export const autorisationDUrbanismeSchema = z
  .object({
    date: dateDAutorisationDUrbanismeSchema,
    numéro: numéroDAutorisationDUrbanismeSchema,
  })
  .optional()
  .transform((val) =>
    val?.date && val?.numéro
      ? {
          date: val.date,
          numéro: val.numéro,
        }
      : undefined,
  );

export const installateurSchema = optionalStringSchema;
export const installationAvecDispositifDeStockageSchema = booleanSchema.optional();
export const natureDeLExploitationSchema = z.enum(
  Lauréat.NatureDeLExploitation.TypeDeNatureDeLExploitation.types,
);
export const natureDeLExploitationOptionalSchema = natureDeLExploitationSchema.optional();
