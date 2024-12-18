import { z } from 'zod';

import { Candidature } from '@potentiel-domain/candidature';

import { getRégionAndDépartementFromCodePostal } from '../helpers';

const requiredStringSchema = z.string().trim().min(1);

const optionalStringSchema = z
  .string()
  .trim()
  .optional()
  .transform((val) => val ?? '');

const _numberSchemaBase = z
  .string()
  // replace french commas to "."
  .transform((str) => (str ? Number(str.replace(/,/g, '.')) : undefined));

const numberSchema = _numberSchemaBase
  // transform to number
  .pipe(z.number());

const strictlyPositiveNumberSchema = _numberSchemaBase
  // transform to number and validate
  .pipe(z.number().gt(0));

const ouiNonSchema = z
  .string()
  .transform((str) => str.toLowerCase())
  .pipe(z.enum(['oui', 'non']))
  .transform((val) => val === 'oui');

const optionalOuiNonSchema = z
  .string()
  .transform((str) => str.toLowerCase())
  .pipe(z.enum(['oui', 'non', '']))
  .transform((val) => val ?? undefined)
  .optional()
  .transform((val) => val === 'oui');

const dateSchema = z
  .string()
  .regex(/^\d{2}\/\d{2}\/\d{4}$/, {
    message: "Le format de la date n'est pas respecté (format attendu : JJ/MM/AAAA)",
  })
  .or(z.literal(''))
  .optional()
  .transform((val) => {
    if (!val) return undefined;
    const [day, month, year] = val.split('/');
    return new Date(`${year}-${month}-${day}`);
  });

const booleanSchema = z
  .string()
  .toLowerCase()
  .optional()
  .default('false')
  .transform((s) => JSON.parse(s))
  .pipe(z.boolean());

const optionalEnum = <TEnumSchema extends [string, ...string[]]>(
  enumSchema: z.ZodEnum<TEnumSchema>,
) =>
  z
    .union([enumSchema, z.literal(''), z.literal('N/A')])
    .transform((v) => (v === '' || v === 'N/A' ? undefined : v))
    .optional();

/**
 * @param field Le champ validé
 * @param referenceField Le champs dont dépend la validation de `field`
 * @param expectedValue la valeur de `referenceField` pour laquelle `field` est requis
 */
const conditionalRequiredError = (
  field: string,
  referenceField: string,
  expectedValue: string,
) => ({
  code: z.ZodIssueCode.invalid_type,
  expected: z.ZodParsedType.string,
  received: z.ZodParsedType.undefined,
  path: [field],
  message: `"${field}" est requis lorsque "${referenceField}" a la valeur "${expectedValue}"`,
});

// Les colonnes du fichier CSV
const colonnes = {
  appelOffre: `Appel d'offres`,
  période: 'Période',
  famille: 'Famille',
  numéroCRE: 'N°CRE',
  nomProjet: 'Nom projet',
  sociétéMère: 'Société mère',
  nomCandidat: 'Candidat',
  puissanceProductionAnnuelle: 'puissance_production_annuelle',
  prixRéférence: 'prix_reference',
  noteTotale: 'Note totale',
  nomReprésentantLégal: 'Nom et prénom du représentant légal',
  emailContact: 'Adresse électronique du contact',
  adresse1: 'N°, voie, lieu-dit 1',
  adresse2: 'N°, voie, lieu-dit 2',
  codePostaux: 'CP',
  commune: 'Commune',
  statut: 'Classé ?',
  motifÉlimination: "Motif d'élimination",
  puissanceÀLaPointe: 'Engagement de fourniture de puissance à la pointe\n(AO ZNI)',
  evaluationCarboneSimplifiée:
    'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)',
  technologie: 'Technologie\n(dispositif de production)',
  typeGf:
    "1. Garantie financière jusqu'à 6 mois après la date d'achèvement\n2. Garantie financière avec date d'échéance et à renouveler\n3. Consignation",
  financementCollectif: 'Financement collectif (Oui/Non)',
  gouvernancePartagée: 'Gouvernance partagée (Oui/Non)',
  dateÉchéanceGf: "Date d'échéance au format JJ/MM/AAAA",
  // TODO quel est le bon nom pour cette colonne?
  historiqueAbandon:
    "1. Lauréat d'aucun AO\n2. Abandon classique\n3. Abandon avec recandidature\n4. Lauréat d'un AO",
  territoireProjet: 'Territoire\n(AO ZNI)',
} as const;

// Order matters! the CSV uses "1"/"2"/"3"
const typeGf = [
  Candidature.TypeGarantiesFinancières.sixMoisAprèsAchèvement.type,
  Candidature.TypeGarantiesFinancières.avecDateÉchéance.type,
  Candidature.TypeGarantiesFinancières.consignation.type,
] as const;

const historiqueAbandon = [
  'première-candidature',
  'abandon-classique',
  'abandon-avec-recandidature',
  'lauréat-autre-période',
] as const;

const statut = {
  éliminé: 'éliminé',
  eliminé: 'éliminé',
  classé: 'classé',
  retenu: 'classé',
} as const;

const technologie = {
  Eolien: 'eolien',
  Hydraulique: 'hydraulique',
  PV: 'pv',
  'N/A': 'N/A',
} as const;

const candidatureCsvRowSchema = z
  .object({
    [colonnes.appelOffre]: requiredStringSchema,
    [colonnes.période]: requiredStringSchema,
    [colonnes.famille]: optionalStringSchema,
    [colonnes.numéroCRE]: requiredStringSchema,
    [colonnes.nomProjet]: requiredStringSchema,
    [colonnes.sociétéMère]: optionalStringSchema,
    [colonnes.nomCandidat]: requiredStringSchema,
    [colonnes.puissanceProductionAnnuelle]: strictlyPositiveNumberSchema,
    [colonnes.prixRéférence]: strictlyPositiveNumberSchema,
    [colonnes.noteTotale]: numberSchema,
    [colonnes.nomReprésentantLégal]: requiredStringSchema,
    [colonnes.emailContact]: requiredStringSchema.email(),
    [colonnes.adresse1]: optionalStringSchema, // see refine below
    [colonnes.adresse2]: optionalStringSchema,
    [colonnes.codePostaux]: requiredStringSchema
      .transform((val) => val.split('/').map((str) => str.trim()))
      .refine(
        (val) => val.every(getRégionAndDépartementFromCodePostal),
        'Le code postal ne correspond à aucune région / département',
      ),
    [colonnes.commune]: requiredStringSchema,
    [colonnes.statut]: z
      .string()
      .toLowerCase()
      .pipe(z.enum(['eliminé', 'éliminé', 'classé', 'retenu'])),
    [colonnes.puissanceÀLaPointe]: optionalOuiNonSchema,
    [colonnes.evaluationCarboneSimplifiée]: z
      .union([z.literal('N/A'), z.literal(''), strictlyPositiveNumberSchema])
      .transform((val) => (val === 'N/A' || val === '' ? 0 : val)),
    [colonnes.technologie]: z
      .union([z.enum(['N/A', 'Eolien', 'Hydraulique', 'PV']), z.literal('')])
      .optional()
      .transform((val) => val || 'N/A'),
    [colonnes.financementCollectif]: ouiNonSchema,
    [colonnes.gouvernancePartagée]: ouiNonSchema,
    [colonnes.historiqueAbandon]: z.enum(['1', '2', '3', '4']),
    // columns with refines
    [colonnes.motifÉlimination]: optionalStringSchema.transform((val) => val || undefined), // see refine below
    [colonnes.typeGf]: optionalEnum(z.enum(['1', '2', '3'])), // see refine below
    [colonnes.dateÉchéanceGf]: dateSchema.optional(), // see refine below
    [colonnes.territoireProjet]: optionalStringSchema, // see refines below
    notifiedOn: z.undefined({
      invalid_type_error: 'Le champs notifiedOn ne peut pas être présent',
    }),
  })
  // le motif d'élimination est obligatoire si la candidature est éliminée
  .superRefine((obj, ctx) => {
    const actualStatut = statut[obj[colonnes.statut]];
    if (actualStatut === 'éliminé' && !obj[colonnes.motifÉlimination]) {
      ctx.addIssue(
        conditionalRequiredError(colonnes.motifÉlimination, colonnes.statut, actualStatut),
      );
    }
  })
  // le type de GF est obligatoire si la candidature est classée
  .superRefine((obj, ctx) => {
    const actualStatut = statut[obj[colonnes.statut]];
    if (actualStatut === 'classé' && !obj[colonnes.typeGf]) {
      ctx.addIssue(conditionalRequiredError(colonnes.typeGf, colonnes.statut, actualStatut));
    }
  })
  // la date d'échéance est obligatoire si les GF sont de type "avec date d'échéance"
  .superRefine((obj, ctx) => {
    const actualStatut = statut[obj[colonnes.statut]];
    if (actualStatut === 'éliminé') return;
    const actualTypeGf = obj[colonnes.typeGf]
      ? typeGf[Number(obj[colonnes.typeGf]) - 1]
      : undefined;
    if (actualTypeGf === 'avec-date-échéance' && !obj[colonnes.dateÉchéanceGf]) {
      ctx.addIssue(conditionalRequiredError(colonnes.dateÉchéanceGf, colonnes.typeGf, '2'));
    }
  })
  // les CRE4 - ZNI nécessitent un territoire projet
  .superRefine((obj, ctx) => {
    const isZNI =
      obj[colonnes.appelOffre] === 'CRE4 - ZNI' || obj[colonnes.appelOffre] === 'CRE4 - ZNI 2017';
    if (isZNI && !obj[colonnes.territoireProjet]) {
      ctx.addIssue(
        conditionalRequiredError(colonnes.territoireProjet, colonnes.appelOffre, 'CRE4 - ZNI'),
      );
    }
  })
  // on ne peut pas avoir financement collectif ET gouvernance partagée
  .refine((val) => !(val[colonnes.financementCollectif] && val[colonnes.gouvernancePartagée]), {
    message: `Seule l'une des deux colonnes "${colonnes.financementCollectif}" et "${colonnes.gouvernancePartagée}" peut avoir la valeur "Oui"`,
    path: [colonnes.financementCollectif, colonnes.gouvernancePartagée],
  })
  // on doit avoir au minimum adresse1 ou adresse2
  .refine((val) => !!val[colonnes.adresse1] || !!val[colonnes.adresse2], {
    message: `Au moins l'une des deux colonnes "${colonnes.adresse1}" et "${colonnes.adresse2}" doit être renseignée`,
    path: [colonnes.adresse1, colonnes.adresse2],
  });

export const candidatureCsvSchema = candidatureCsvRowSchema
  // Transforme les noms des clés de la ligne en valeurs plus simples à manipuler
  .transform((val) => {
    type CandidatureShape = {
      [P in keyof typeof colonnes]: (typeof val)[(typeof colonnes)[P]];
    };
    return (Object.keys(colonnes) as (keyof typeof colonnes)[]).reduce(
      (prev, curr) => ({ ...prev, [curr]: val[colonnes[curr]] }),
      {} as unknown as CandidatureShape,
    );
  })
  // Transforme les valeurs en index ("1,2,3") en des valeurs plus claires ("avec-date-échéance")
  .transform((val) => {
    return {
      ...val,
      typeGf: val.typeGf ? typeGf[Number(val.typeGf) - 1] : undefined,
      historiqueAbandon: historiqueAbandon[Number(val.historiqueAbandon) - 1],
      statut: statut[val.statut],
      technologie: technologie[val.technologie],
    };
  });

export type CandidatureCsvRowShape = z.infer<typeof candidatureCsvRowSchema>;
export type CandidatureShape = z.infer<typeof candidatureCsvSchema>;

/** Schema simplifié pour utilisation sans données CSV */
export const candidatureSchema = z
  .object({
    identifiantProjet: z.string(),
    nomProjet: requiredStringSchema,
    societeMere: optionalStringSchema,
    nomCandidat: requiredStringSchema,
    puissanceProductionAnnuelle: strictlyPositiveNumberSchema,
    prixReference: strictlyPositiveNumberSchema,
    noteTotale: numberSchema,
    nomRepresentantLegal: requiredStringSchema,
    emailContact: requiredStringSchema.email(),

    adresse1: requiredStringSchema,
    adresse2: optionalStringSchema,
    codePostal: requiredStringSchema
      .transform((val) => val.split('/').map((str) => str.trim()))
      .refine(
        (val) => val.every(getRégionAndDépartementFromCodePostal),
        'Le code postal ne correspond à aucune région / département',
      )
      .transform((val) => val.join(' / ')),
    commune: requiredStringSchema,
    // optionnel car une fois notifié, ce champs n'est plus modifiable
    statut: z.enum(Candidature.StatutCandidature.statuts).optional(),
    puissanceALaPointe: booleanSchema,
    evaluationCarboneSimplifiee: strictlyPositiveNumberSchema,
    actionnariat: optionalEnum(z.enum(Candidature.TypeActionnariat.types)),
    doitRegenererAttestation: booleanSchema.optional(),
    motifElimination: optionalStringSchema.transform((val) => val || undefined), // see refine below
    technologie: z.enum(Candidature.TypeTechnologie.types),

    typeGarantiesFinancieres: optionalEnum(z.enum(Candidature.TypeGarantiesFinancières.types)), // see refine below
    dateEcheanceGf: z
      .string()
      .transform((str) => (str ? new Date(str) : undefined))
      .optional(), // see refine below

    // Champs non modifiable à l'heure actuelle, mais à ajouter?
    // historiqueAbandon: z.enum(Candidature.HistoriqueAbandon.types),
  })
  // le motif d'élimination est obligatoire si la candidature est éliminée
  .superRefine((obj, ctx) => {
    if (obj.statut === 'éliminé' && !obj.motifElimination) {
      ctx.addIssue(conditionalRequiredError('motifElimination', 'statut', 'éliminé'));
    }
  })
  // le type de GF est obligatoire si la candidature est classée
  .superRefine((obj, ctx) => {
    if (obj.statut === 'classé' && !obj.typeGarantiesFinancieres) {
      ctx.addIssue(conditionalRequiredError('typeGarantiesFinancieres', 'statut', 'classé'));
    }
  })
  // la date d'échéance est obligatoire si les GF sont de type "avec date d'échéance"
  .superRefine((obj, ctx) => {
    const actualTypeGf = obj.typeGarantiesFinancieres
      ? typeGf[Number(obj.typeGarantiesFinancieres)]
      : undefined;
    if (obj.statut === 'classé' && actualTypeGf === 'avec-date-échéance' && !obj.motifElimination) {
      ctx.addIssue(
        conditionalRequiredError(
          'dateEcheanceGf',
          'typeGarantiesFinancieres',
          'avec-date-échéance',
        ),
      );
    }
  });
