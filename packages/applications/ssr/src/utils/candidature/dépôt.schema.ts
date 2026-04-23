import { z } from 'zod';

import { Candidature, Lauréat } from '@potentiel-domain/projet';
import { récupérerDépartementRégionParCodePostal } from '@potentiel-domain/inmemory-referential';
import { DateTime } from '@potentiel-domain/common';

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

export const dateDAutorisationSchema = optionalDateSchema;
export const numéroDAutorisationSchema = optionalStringSchema;

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
    tauxPrévisionnelACC: optionalPercentageSchema,
  })
  .superRefine((data, ctx) => {
    if (
      data.typeNatureDeLExploitation === 'autoconsommation-individuelle' &&
      data.tauxPrévisionnelACI === undefined
    ) {
      ctx.addIssue({
        code: 'custom',
        message: `Le taux prévisionnel ACI est requis lorsque la nature de l'exploitation est de type "autoconsommation individuelle" (vente avec injection du surplus)`,
        path: ['tauxPrévisionnelACI'],
      });
    }

    if (
      data.typeNatureDeLExploitation === 'autoconsommation-individuelle' &&
      data.tauxPrévisionnelACC !== undefined
    ) {
      ctx.addIssue({
        code: 'custom',
        message: `Le taux prévisionnel ACC doit être vide lorsque la nature de l'exploitation est de type "autoconsommation individuelle" (vente avec injection du surplus)`,
        path: ['tauxPrévisionnelACC'],
      });
    }

    if (
      data.typeNatureDeLExploitation === 'autoconsommation-collective' &&
      data.tauxPrévisionnelACC === undefined
    ) {
      ctx.addIssue({
        code: 'custom',
        message: `Le taux prévisionnel ACC est requis lorsque la nature de l'exploitation est de type "autoconsommation collective"`,
        path: ['tauxPrévisionnelACC'],
      });
    }

    if (
      data.typeNatureDeLExploitation === 'autoconsommation-collective' &&
      data.tauxPrévisionnelACI !== undefined
    ) {
      ctx.addIssue({
        code: 'custom',
        message: `Le taux prévisionnel ACI doit être vide lorsque la nature de l'exploitation est de type "autoconsommation collective"`,
        path: ['tauxPrévisionnelACI'],
      });
    }

    if (
      data.typeNatureDeLExploitation === 'autoconsommation-individuelle-et-collective' &&
      (data.tauxPrévisionnelACC === undefined || data.tauxPrévisionnelACI === undefined)
    ) {
      ctx.addIssue({
        code: 'custom',
        message: `Les taux prévisionnels ACI et ACC sont requis lorsque la nature de l'exploitation est de type "autoconsommation individuelle et collective"`,
        path: ['tauxPrévisionnelACI', 'tauxPrévisionnelACC'],
      });
    }

    if (
      data.typeNatureDeLExploitation === 'vente-avec-injection-en-totalité' &&
      (data.tauxPrévisionnelACI !== undefined || data.tauxPrévisionnelACC !== undefined)
    ) {
      ctx.addIssue({
        code: 'custom',
        message: `Les taux prévisionnels ACI et ACC doivent être vides lorsque l'exploitation est de type "vente avec injection en totalité"`,
        path: ['tauxPrévisionnelACI', 'tauxPrévisionnelACC'],
      });
    }
  })
  .optional();

const autorisationSchema = z
  .object({
    date: dateDAutorisationSchema,
    numéro: numéroDAutorisationSchema,
  })
  .optional()
  .refine((val) => (val?.date && val?.numéro) || (!val?.date && !val?.numéro), {
    message: `La date et le numéro de l'autorisation doivent être tous les deux renseignés.`,
  })
  .transform((val) =>
    val?.date && val?.numéro
      ? {
          date: val.date,
          numéro: val.numéro,
        }
      : undefined,
  );

const numéroImmatriculationSchema = z
  .object({
    siren: z.string().optional(),
    siret: z.string().optional(),
  })
  .optional()
  .transform((val) =>
    val?.siren || val?.siret
      ? {
          siret: val.siret,
          siren: val.siret ? val.siret.slice(0, 9) : val.siren,
        }
      : undefined,
  );

export const dépôtSchema = z
  .object({
    nomProjet: requiredStringSchema,
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
    autorisation: autorisationSchema,
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
    numéroImmatriculation: numéroImmatriculationSchema,
    raccordements: z
      .array(
        z.object({
          référence: z.string(),
          dateQualification: z
            .string()
            .transform((val) => DateTime.convertirEnValueType(new Date(val)).formatter()),
        }),
      )
      .optional(),
    fournisseurs: z
      .array(
        z.object({
          typeFournisseur: z.enum(Lauréat.Fournisseur.TypeFournisseur.typesFournisseur),
          nomDuFabricant: z.string(),
          lieuDeFabrication: z.string(),
        }),
      )
      .optional(),
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
