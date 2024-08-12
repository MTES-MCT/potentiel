import { z } from 'zod';

const requiredStringSchema = z.string().trim().min(1);
const numberSchema = z
  .string()
  // replace french commas to "."
  .transform((str) => str.replace(/,/g, '.'))
  // transform to number
  .pipe(z.coerce.number());
const strictlyPositiveNumberSchema = z
  .string()
  // replace french commas to "."
  .transform((str) => str.replace(/,/g, '.'))
  // transform to number and validate
  .pipe(z.coerce.number().gt(0));

const ouiNonSchema = z
  .string()
  .transform((str) => str.toLowerCase())
  .pipe(z.enum(['oui', 'non', '']))
  .transform((str) => str || undefined);

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

/**
 * @field field le champs validé
 * @field referenceField le champs dont dépend la validation de `field`
 * @field expectedValue la valeur de `referenceField` pour laquelle `field` est requis
 */
const requiredFieldIfReferenceFieldEquals = <
  T,
  TField extends keyof T,
  TReferenceField extends keyof T,
>(
  field: TField,
  referenceField: TReferenceField,
  expectedValue: T[TReferenceField],
): ((arg: T, ctx: z.RefinementCtx) => unknown | Promise<unknown>) => {
  return (val, ctx) => {
    if (val[referenceField] === expectedValue && !val[field]) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_type,
        expected: z.ZodParsedType.string,
        received: z.ZodParsedType.undefined,
        path: [String(field)],
        message: `"${String(field)}" est requis lorsque "${String(referenceField)}" a la valeur "${expectedValue}"`,
      });
      return false;
    }
    return true;
  };
};

const colonnes = {
  appel_offre: `Appel d'offres`,
  période: 'Période',
  famille: 'Famille',
  num_cre: 'N°CRE',
  nom_projet: 'Nom projet',
  société_mère: 'Société mère',
  nom_candidat: 'Candidat',
  puissance_production_annuelle: 'puissance_production_annuelle',
  prix_reference: 'prix_reference',
  note_totale: 'Note totale',
  nom_représentant_légal: 'Nom et prénom du représentant légal',
  email_contact: 'Adresse électronique du contact',
  adresse1: 'N°, voie, lieu-dit 1',
  adresse2: 'N°, voie, lieu-dit 2',
  code_postal: 'CP',
  commune: 'Commune',
  statut: 'Classé ?',
  motif_élimination: "Motif d'élimination",
  puissance_a_la_pointe: 'Engagement de fourniture de puissance à la pointe\n(AO ZNI)',
  evaluation_carbone_simplifiée:
    'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)',
  valeur_évaluation_carbone: 'Valeur de l’évaluation carbone des modules (kg eq CO2/kWc)',
  technologie: 'Technologie\n(dispositif de production)',
  type_gf:
    "1. Garantie financière jusqu'à 6 mois après la date d'achèvement\n2. Garantie financière avec date d'échéance et à renouveler\n3. Consignation",
  financement_collectif: 'Financement collectif (Oui/Non)',
  financement_participatif: 'Investissement ou financement participatif ?',
  gouvernance_partagée: 'Gouvernance partagée (Oui/Non)',
  date_échéance_gf: "Date d'échéance au format JJ/MM/AAAA",
  // TODO quel est le bon nom pour cette colonne?
  historique_abandon:
    "1. 1ère candidature\n2. Abandon classique\n3. Abandon avec recandidature\n4. Lauréat d'une autre période",
} as const;

// Order matters! the CSV uses "1"/"2"/"3"
const typeGf = ['six-mois-après-achèvement', 'avec-date-échéance', 'consignation'] as const;
const historiqueAbandon = [
  'première-candidature',
  'abandon-classique',
  'abandon-avec-recandidature',
  'lauréat-autre-période',
] as const;

const statut = { Eliminé: 'éliminé', Classé: 'classé' } as const;
const technologie = {
  Eolien: 'eolien',
  Hydraulique: 'hydraulique',
  PV: 'pv',
  'N/A': 'N/A',
} as const;

const candidatureCsvRowSchema = z
  .object({
    [colonnes.appel_offre]: requiredStringSchema,
    [colonnes.période]: requiredStringSchema,
    [colonnes.famille]: z.string().optional(),
    [colonnes.num_cre]: requiredStringSchema,
    [colonnes.nom_projet]: requiredStringSchema,
    [colonnes.société_mère]: z.string().optional(),
    [colonnes.nom_candidat]: requiredStringSchema,
    [colonnes.puissance_production_annuelle]: strictlyPositiveNumberSchema,
    [colonnes.prix_reference]: strictlyPositiveNumberSchema,
    [colonnes.note_totale]: numberSchema,
    [colonnes.nom_représentant_légal]: requiredStringSchema,
    [colonnes.email_contact]: requiredStringSchema.email(),
    [colonnes.adresse1]: requiredStringSchema,
    [colonnes.adresse2]: z.string().optional(),
    [colonnes.code_postal]: requiredStringSchema,
    [colonnes.commune]: requiredStringSchema,
    [colonnes.statut]: z.string().pipe(z.enum(['Eliminé', 'Classé'])),
    [colonnes.motif_élimination]: z.string().optional(), // see refine below
    [colonnes.puissance_a_la_pointe]: ouiNonSchema.optional(),
    [colonnes.evaluation_carbone_simplifiée]: z
      .union([z.enum(['N/A']), strictlyPositiveNumberSchema])
      .transform((val) => (val === 'N/A' ? 0 : val)),
    [colonnes.valeur_évaluation_carbone]: strictlyPositiveNumberSchema.optional(),
    [colonnes.technologie]: z
      .enum(['N/A', 'Eolien', 'Hydraulique', 'PV'])
      .optional()
      .default('N/A'),
    [colonnes.financement_collectif]: ouiNonSchema,
    [colonnes.financement_participatif]: ouiNonSchema,
    [colonnes.gouvernance_partagée]: ouiNonSchema,
    [colonnes.type_gf]: z.enum(['1', '2', '3']).optional(), // see refine below
    [colonnes.date_échéance_gf]: dateSchema.optional(), // see refine below
    [colonnes.historique_abandon]: z.enum(['1', '2', '3', '4']),
  })
  // le motif d'élimination est obligatoire si la candidature est éliminée
  .superRefine(
    requiredFieldIfReferenceFieldEquals(colonnes.motif_élimination, colonnes.statut, 'Eliminé'),
  )
  // le type de GF est obligatoire si la candidature est classée
  .superRefine(requiredFieldIfReferenceFieldEquals(colonnes.type_gf, colonnes.statut, 'Classé'))
  // la date d'échéance est obligatoire si les GF sont de type "avec date d'échéance"
  .superRefine(
    requiredFieldIfReferenceFieldEquals(
      "Date d'échéance au format JJ/MM/AAAA",
      colonnes.type_gf,
      '2',
    ),
  );

export const candidatureSchema = candidatureCsvRowSchema
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
      type_gf: val.type_gf ? typeGf[Number(val.type_gf) - 1] : undefined,
      historique_abandon: historiqueAbandon[Number(val.historique_abandon) - 1],
      statut: statut[val.statut],
      technologie: technologie[val.technologie],
    };
  });

export type CandidatureCsvRowShape = z.infer<typeof candidatureCsvRowSchema>;
export type CandidatureShape = z.infer<typeof candidatureSchema>;
