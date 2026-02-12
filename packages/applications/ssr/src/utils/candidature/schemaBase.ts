import { z } from 'zod';

import { DateTime } from '@potentiel-domain/common';

export const requiredStringSchema = z.string().trim().min(1);

export const optionalStringSchema = z.string().trim().optional();
export const optionalStringWithDefaultValueSchema = z
  .string()
  .trim()
  .optional()
  .transform((v) => v ?? '');

export const _numberSchemaBase = z.preprocess((val) => {
  if (val === '' || val === null || val === undefined) {
    return undefined;
  }

  if (typeof val === 'string') {
    const parsed = Number(val.replace(/,/g, '.'));
    return Number.isNaN(parsed) ? val : parsed;
  }

  return val;
}, z.number());

export const numberSchema = _numberSchemaBase
  // transform to number
  .pipe(z.number());

export const optionalNumberSchema = _numberSchemaBase
  .optional()
  // transform to number
  .pipe(z.number().optional());

export const optionalDateSchema = z
  .string()
  .transform((val) => (val ? DateTime.convertirEnValueType(new Date(val)).formatter() : undefined))
  .optional();

export const strictlyPositiveNumberSchema = _numberSchemaBase
  // transform to number and validate
  .pipe(z.number().gt(0));

export const optionalStrictlyPositiveNumberSchema = _numberSchemaBase
  .optional()
  // transform to number and validate
  .pipe(z.number().gt(0).optional());

export const optionalPercentageSchema = _numberSchemaBase
  .optional()
  // transform to number and validate
  .pipe(z.number().gte(0).lte(100).optional());

export const ouiNonSchema = z.stringbool({
  truthy: ['true', 'oui'],
  falsy: ['false', 'non'],
});

export const booleanSchema = z.union([z.boolean(), ouiNonSchema], {
  message: 'La valeur doit être un booléen ou "oui" / "non"',
});

export const optionalEnum = <TEnumSchema extends Readonly<Record<string, string>>>(
  enumSchema: z.ZodEnum<TEnumSchema>,
) => {
  type EnumValue = TEnumSchema[keyof TEnumSchema];

  return z
    .string()
    .optional()
    .transform((v) => v?.toLowerCase())
    .refine(
      (v) =>
        v === undefined || v === '' || v === 'n/a' || enumSchema.options.includes(v as EnumValue),
      `Option invalide : une valeur parmi ${enumSchema.options
        .map((o) => `"${o}"`)
        .join('|')} attendue`,
    )
    .transform((v) => (v === '' || v === 'n/a' ? undefined : (v as EnumValue)));
};

export const optionalEnumForCorrection = <TEnumSchema extends Readonly<Record<string, string>>>(
  enumSchema: z.ZodEnum<TEnumSchema>,
) =>
  z
    .string()
    .toLowerCase()
    .optional()
    .pipe(z.union([enumSchema, z.literal('')]).optional());

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
  expected: 'string' as const,
  received: undefined,
  path: [field],
  message: `"${field}" est requis lorsque "${referenceField}" a la valeur "${expectedValue}"`,
});

export const stringToArray = (value: string, separator: string) =>
  value
    .split(separator)
    .map((str) => str.trim())
    .filter(Boolean);
