import type { Meta } from '@storybook/react';
import { z } from 'zod';

import { ValidationErrors } from '@/utils/formAction';

import { AutoFormFieldProps, makeAutoFormField } from './AutoFormField';

const optionalEnum = <TEnumSchema extends [string, ...string[]]>(
  enumSchema: z.ZodEnum<TEnumSchema>,
) =>
  z
    .union([enumSchema, z.literal(''), z.literal('N/A')])
    .transform((v) => (v === '' || v === 'N/A' ? undefined : v))
    .optional();

const schema = z.object({
  requiredStringField: z.string(),
  requiredNumberField: z.number(),
  requiredDateField: z.date(),
  enumField: z.enum(['first', 'second']),
  optionalEnumField: optionalEnum(z.enum(['first', 'second'])),
  booleanField: z.boolean(),
  optionalBooleanField: z.boolean().optional(),
});

const value: z.infer<typeof schema> = {
  requiredStringField: 'foo',
  requiredNumberField: 1,
  requiredDateField: new Date(),
  enumField: 'second',
  booleanField: false,
};

const errors: ValidationErrors<keyof z.infer<typeof schema>> = {
  requiredNumberField: 'bad value',
  requiredStringField: 'invalid',
  enumField: 'missing',
};

const AutoFormField = makeAutoFormField(schema, {}, {});
const AutoFormFieldWithValue = makeAutoFormField(schema, value, {});
const AutoFormFieldWithError = makeAutoFormField(schema, value, errors);

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Atoms/Form/AutoFormField',
  component: AutoFormField,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<AutoFormFieldProps<typeof schema, keyof z.infer<typeof schema>>>;

export default meta;

export const RequiredString = () => <AutoFormField name="requiredStringField" />;
export const RequiredStringWithValue = () => <AutoFormFieldWithValue name="requiredStringField" />;
export const RequiredStringWithError = () => <AutoFormFieldWithError name="requiredStringField" />;

export const RequiredNumber = () => <AutoFormField name="requiredNumberField" />;
export const RequiredNumberWithValue = () => <AutoFormFieldWithValue name="requiredNumberField" />;
export const RequiredNumberWithError = () => <AutoFormFieldWithError name="requiredNumberField" />;

export const RequiredDate = () => <AutoFormField name="requiredDateField" />;
export const RequiredDateWithValue = () => <AutoFormFieldWithValue name="requiredDateField" />;
export const RequiredDateWithError = () => <AutoFormFieldWithError name="requiredNumberField" />;

export const Enum = () => <AutoFormField name="enumField" />;
export const EnumWithValue = () => <AutoFormFieldWithValue name="enumField" />;
export const OptionalEnum = () => <AutoFormField name="optionalEnumField" />;

export const Boolean = () => <AutoFormField name="booleanField" />;
export const BooleanWithValue = () => <AutoFormFieldWithValue name="booleanField" />;
export const OptionalBoolean = () => <AutoFormField name="optionalBooleanField" />;
