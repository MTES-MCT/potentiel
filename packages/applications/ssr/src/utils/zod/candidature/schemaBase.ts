import { z } from 'zod';

export const requiredStringSchema = z.string().trim().min(1);

export const optionalStringSchema = z
  .string()
  .trim()
  .optional()
  .transform((val) => val ?? '');

export const _numberSchemaBase = z
  .string()
  // replace french commas to "."
  .transform((str) => (str ? Number(str.replace(/,/g, '.')) : undefined));

export const numberSchema = _numberSchemaBase
  // transform to number
  .pipe(z.number());

export const strictlyPositiveNumberSchema = _numberSchemaBase
  // transform to number and validate
  .pipe(z.number().gt(0));

export const ouiNonSchema = z
  .string()
  .transform((str) => str.toLowerCase())
  .pipe(z.enum(['oui', 'non']))
  .transform((val) => val === 'oui');

export const optionalOuiNonSchema = z
  .string()
  .transform((str) => str.toLowerCase())
  .pipe(z.enum(['oui', 'non', '']))
  .transform((val) => val ?? undefined)
  .optional()
  .transform((val) => val === 'oui');

export const dateSchema = z
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

export const booleanSchema = z
  .string()
  .toLowerCase()
  .optional()
  .default('false')
  .transform((s) => JSON.parse(s))
  .pipe(z.boolean());

export const optionalEnum = <TEnumSchema extends [string, ...string[]]>(
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
export const conditionalRequiredError = (
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
