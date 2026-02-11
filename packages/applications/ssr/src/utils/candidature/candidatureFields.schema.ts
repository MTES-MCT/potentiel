import { z } from 'zod';

import { Candidature, Lauréat } from '@potentiel-domain/projet';
import { récupérerDépartementRégionParCodePostal } from '@potentiel-domain/inmemory-referential';

import { conditionalRequiredError } from '../candidature/schemaBase';

import {
  booleanSchema,
  numberSchema,
  optionalDateSchema,
  optionalEnum,
  optionalEnumForCorrection,
  optionalPercentageSchema,
  optionalStrictlyPositiveNumberSchema,
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
export const optionalPuissanceSchema = optionalStrictlyPositiveNumberSchema;
export const prixRéférenceSchema = strictlyPositiveNumberSchema;
export const noteTotaleSchema = numberSchema;
export const nomReprésentantLégalSchema = requiredStringSchema;
export const emailContactSchema = requiredStringSchema.pipe(z.email());
export const adresse1Schema = requiredStringSchema;
export const adresse2Schema = optionalStringSchema;

// On accepte de multiples code postaux séparés par /
export const codePostalSchema = requiredStringSchema
  .transform((val) => stringToArray(val, '/').map((val) => val.padStart(5, '0')))
  .refine((val) => val.length > 0, 'Le code postal est requis')
  .refine(
    (val) => !val || val.every(récupérerDépartementRégionParCodePostal),
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
export const dateEchéanceOuConstitutionGfSchema = optionalDateSchema;
export const territoireProjetSchema = optionalStringWithDefaultValueSchema;

export const choixCoefficientKSchema = booleanSchema.optional();
export const obligationDeSolarisationSchema = booleanSchema.optional();

export const puissanceOuPuissanceDeSiteSchema = strictlyPositiveNumberSchema;
export const optionalPuissanceOuPuissanceDeSiteSchema = optionalStrictlyPositiveNumberSchema;

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

export const dispositifDeStockageSchema = z
  .object({
    installationAvecDispositifDeStockage: booleanSchema,
    capacitéDuDispositifDeStockageEnKWh: optionalStrictlyPositiveNumberSchema,
    puissanceDuDispositifDeStockageEnKW: optionalStrictlyPositiveNumberSchema,
  })
  .refine(
    (data) =>
      !data.installationAvecDispositifDeStockage ||
      (data.capacitéDuDispositifDeStockageEnKWh !== undefined &&
        data.puissanceDuDispositifDeStockageEnKW !== undefined),
    {
      message: `"capacitéDuDispositifDeStockageEnKWh" et "puissanceDuDispositifDeStockageEnKW" sont requis lorsque l'installation est avec dispositif de stockage`,
      path: ['capacitéDuDispositifDeStockageEnKWh', 'puissanceDuDispositifDeStockageEnKW'],
    },
  )
  .optional();

export const natureDeLExploitationOptionalSchema = z
  .object({
    typeNatureDeLExploitation: z.enum(
      Lauréat.NatureDeLExploitation.TypeDeNatureDeLExploitation.types,
    ),
    tauxPrévisionnelACI: optionalPercentageSchema,
  })
  .superRefine((data, ctx) => {
    if (
      Lauréat.NatureDeLExploitation.TypeDeNatureDeLExploitation.convertirEnValueType(
        data.typeNatureDeLExploitation,
      ).estÉgaleÀ(
        Lauréat.NatureDeLExploitation.TypeDeNatureDeLExploitation.venteAvecInjectionEnSurplus,
      )
    ) {
      if (!data.tauxPrévisionnelACI) {
        ctx.addIssue(
          conditionalRequiredError(
            'tauxPrévisionnelACI',
            'typeNatureDeLExploitation',
            'vente-avec-injection-du-surplus',
          ),
        );
      }
    }
  })
  .optional();
