import { z } from 'zod';

import { Candidature, Lauréat } from '@potentiel-domain/projet';
import { récupérerDépartementRégionParCodePostal } from '@potentiel-domain/inmemory-referential';

import {
  booleanSchema,
  optionalDateSchema,
  optionalEnum,
  optionalPercentageSchema,
  optionalStrictlyPositiveNumberSchema,
  optionalStringSchema,
  optionalStringWithDefaultValueSchema,
  requiredStringSchema,
  strictlyPositiveNumberSchema,
  stringToArray,
} from './schemaBase';

export const dateDAutorisationDUrbanismeSchema = optionalDateSchema;
export const numéroDAutorisationDUrbanismeSchema = optionalStringSchema;

const localitéSchema = z.object({
  adresse1: requiredStringSchema,
  adresse2: optionalStringSchema,
  // On accepte de multiples code postaux séparés par /
  codePostal: requiredStringSchema
    .transform((val) => stringToArray(val, '/').map((val) => val.padStart(5, '0')))
    .refine((val) => val.length > 0, 'Le code postal est requis')
    .refine(
      (val) => !val || val.every(récupérerDépartementRégionParCodePostal),
      'Le code postal ne correspond à aucune région / département',
    )
    .transform((val) => val.join(' / ')),
  commune: requiredStringSchema.transform((val) => stringToArray(val, '/').join(' / ')),
  département: requiredStringSchema,
  région: requiredStringSchema,
});

const dispositifDeStockageSchema = z
  .object({
    installationAvecDispositifDeStockage: booleanSchema,
    capacitéDuDispositifDeStockageEnKWh: optionalStrictlyPositiveNumberSchema,
    puissanceDuDispositifDeStockageEnKW: optionalStrictlyPositiveNumberSchema,
  })
  .superRefine((data, ctx) => {
    if (
      data.installationAvecDispositifDeStockage &&
      (!data.installationAvecDispositifDeStockage || !data.puissanceDuDispositifDeStockageEnKW)
    ) {
      ctx.addIssue({
        code: 'custom',
        message: `capacité et puissance du dispositif de stockage sont requis lorsque l'installation est avec dispositif de stockage`,
        path: ['capacitéDuDispositifDeStockageEnKWh', 'puissanceDuDispositifDeStockageEnKW'],
      });
    }
    if (
      !data.installationAvecDispositifDeStockage &&
      (data.installationAvecDispositifDeStockage || data.puissanceDuDispositifDeStockageEnKW)
    ) {
      ctx.addIssue({
        code: 'custom',
        message: `capacité et puissance du dispositif de stockage doivent rester vides lorsque l'installation est sans dispositif de stockage`,
        path: ['capacitéDuDispositifDeStockageEnKWh', 'puissanceDuDispositifDeStockageEnKW'],
      });
    }
  })
  .optional();

const natureDeLExploitationOptionalSchema = z
  .object({
    typeNatureDeLExploitation: z.enum(
      Lauréat.NatureDeLExploitation.TypeDeNatureDeLExploitation.types,
    ),
    tauxPrévisionnelACI: optionalPercentageSchema,
  })
  .superRefine((data, ctx) => {
    if (
      data.typeNatureDeLExploitation === 'vente-avec-injection-du-surplus' &&
      data.tauxPrévisionnelACI === undefined
    ) {
      ctx.addIssue({
        code: 'custom',
        message: `"tauxPrévisionnelACI" est requis lorsque le type de la nature de l'exploitation est avec injection du surplus`,
        path: ['tauxPrévisionnelACI'],
      });
    }

    if (
      data.typeNatureDeLExploitation === 'vente-avec-injection-en-totalité' &&
      data.tauxPrévisionnelACI !== undefined
    ) {
      ctx.addIssue({
        code: 'custom',
        message: `"tauxPrévisionnelACI" doit être vide lorsque le type de la nature de l'exploitation est avec injection en totalité`,
        path: ['tauxPrévisionnelACI'],
      });
    }
  })
  .optional();

const autorisationDUrbanismeSchema = z
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

export const dépôtSchema = z
  .object({
    nomProjet: requiredStringSchema,
    // est ce qu'on pourrait l'appeler actionnaire ?
    sociétéMère: optionalStringWithDefaultValueSchema,
    nomCandidat: requiredStringSchema,
    puissance: strictlyPositiveNumberSchema,
    prixReference: strictlyPositiveNumberSchema,
    nomReprésentantLégal: requiredStringSchema,
    emailContact: requiredStringSchema.pipe(z.email()),
    puissanceALaPointe: booleanSchema.optional().default(false),
    evaluationCarboneSimplifiée: strictlyPositiveNumberSchema,
    actionnariat: optionalEnum(z.enum(Candidature.TypeActionnariat.types)),
    technologie: z.enum(Candidature.TypeTechnologie.types),
    typeGarantiesFinancières: optionalEnum(z.enum(Candidature.TypeGarantiesFinancières.types)),
    dateÉchéanceGf: optionalDateSchema,
    dateConstitutionGf: optionalDateSchema,
    coefficientKChoisi: booleanSchema.optional(),
    historiqueAbandon: z.enum(Candidature.HistoriqueAbandon.types),
    obligationDeSolarisation: booleanSchema.optional(),
    puissanceDeSite: optionalStrictlyPositiveNumberSchema,
    autorisationDUrbanisme: autorisationDUrbanismeSchema,
    installateur: optionalStringSchema,
    localité: localitéSchema,
    typologieInstallation: z.array(
      z.object({
        typologie: z.enum(Candidature.TypologieInstallation.typologies),
        détails: z.string().optional(),
      }),
    ),
    dispositifDeStockage: dispositifDeStockageSchema,
    natureDeLExploitation: natureDeLExploitationOptionalSchema,
    puissanceProjetInitial: optionalStrictlyPositiveNumberSchema,
  })
  // Garanties financières et date d'échéance
  .superRefine((data, ctx) => {
    const typeGF = data.typeGarantiesFinancières;
    if (typeGF === 'avec-date-échéance' && !data.dateÉchéanceGf) {
      ctx.addIssue({
        code: 'custom',
        message: `La date d'échéance des garanties financières est requise lorsque le type est "avec date d'échéance"`,
        path: ['dateÉchéanceGf'],
      });
    }

    if (typeGF !== 'avec-date-échéance' && data.dateÉchéanceGf) {
      ctx.addIssue({
        code: 'custom',
        message: `La date d'échéance des garanties financières ne doit pas être complétée lorsque le type n'est pas "avec date d'échéance"`,
        path: ['dateÉchéanceGf'],
      });
    }
  });
