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
  .pipe(z.enum(['oui', 'non']));

const dateSchema = z
  .string()
  .regex(/^\d{2}\/\d{2}\/\d{4}$/, {
    message: "Le format de la date n'est pas respecté (format attendu : JJ/MM/AAAA)",
  })
  .transform((val) => {
    const [day, month, year] = val.split('/');
    return new Date(`${year}-${month}-${day}`);
  });

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

const TYPE_GF_FIELD_NAME =
  "1. Garantie financière jusqu'à 6 mois après la date d'achèvement\n2. Garantie financière avec date d'échéance et à renouveler\n3. Consignation";

const typeGf = {
  'six-mois-après-achèvement': '1' as const,
  'avec-date-échéance': '2' as const,
  consignation: '3' as const,
};

export const candidatureSchema = z
  .object({
    "Appel d'offres": requiredStringSchema,
    Période: requiredStringSchema,
    Famille: z.string().optional(),
    'N°CRE': requiredStringSchema,
    'Nom projet': requiredStringSchema,
    'Société mère': z.string().optional(),
    Candidat: requiredStringSchema,
    puissance_production_annuelle: strictlyPositiveNumberSchema,
    prix_reference: strictlyPositiveNumberSchema,
    'Note totale': numberSchema,
    'Nom et prénom du représentant légal': requiredStringSchema,
    'Adresse électronique du contact': requiredStringSchema.email(), // TODO
    'N°, voie, lieu-dit 1': requiredStringSchema,
    'N°, voie, lieu-dit 2': z.string().optional(),
    CP: requiredStringSchema,
    Commune: requiredStringSchema,
    'Classé ?': z.string().pipe(z.enum(['Eliminé', 'Classé'])),
    "Motif d'élimination": z.string().optional(), // see refine below
    'Engagement de fourniture de puissance à la pointe\n(AO ZNI)': ouiNonSchema.optional(),
    'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)':
      z.union([z.enum(['N/A']), strictlyPositiveNumberSchema]),
    'Valeur de l’évaluation carbone des modules (kg eq CO2/kWc)':
      strictlyPositiveNumberSchema.optional(),
    'Technologie\n(dispositif de production)': z.enum(['N/A', 'Eolien', 'Hydraulique', 'PV']),
    'Financement collectif (Oui/Non)': ouiNonSchema,
    'Gouvernance partagée (Oui/Non)': ouiNonSchema,
    [TYPE_GF_FIELD_NAME]: z
      .enum([
        typeGf['six-mois-après-achèvement'],
        typeGf['avec-date-échéance'],
        typeGf.consignation,
      ])
      .optional(), // see refine below
    "Date d'échéance au format JJ/MM/AAAA": dateSchema.optional(), // see refine below
    "1. Lauréat d'aucun AO\n2. Abandon classique\n3. Abandon avec recandidature\n4. Lauréat d'un AO":
      z.enum(['1', '2', '3', '4']),
  })
  // le motif d'élimination est obligatoire si la candidature est éliminée
  .superRefine(requiredFieldIfReferenceFieldEquals("Motif d'élimination", 'Classé ?', 'Eliminé'))
  // le type de GF est obligatoire si la candidature est classée
  .superRefine(requiredFieldIfReferenceFieldEquals(TYPE_GF_FIELD_NAME, 'Classé ?', 'Classé'))
  // la date d'échéance est obligatoire si les GF sont de type "avec date d'échéance"
  .superRefine(
    requiredFieldIfReferenceFieldEquals(
      "Date d'échéance au format JJ/MM/AAAA",
      TYPE_GF_FIELD_NAME,
      typeGf['avec-date-échéance'],
    ),
  );

export type CandidatureSchema = z.infer<typeof candidatureSchema>;
