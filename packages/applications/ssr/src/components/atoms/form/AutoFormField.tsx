import { z } from 'zod';
import Input from '@codegouvfr/react-dsfr/Input';
import Select, { SelectProps } from '@codegouvfr/react-dsfr/SelectNext';
import { HTMLInputTypeAttribute } from 'react';

import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import type { ValidationErrors } from '@/utils/formAction';

import { InputDate } from './InputDate';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ZodSchema = z.ZodEffects<any> | z.ZodObject<any>;

export type AutoFormFieldProps<TSchema extends z.ZodType, TField extends keyof z.infer<TSchema>> = {
  name: TField;
  label?: string;
  disabled?: boolean;
  value?: string | undefined;
};

export const makeAutoFormField = <TSchema extends ZodSchema>(
  schema: TSchema,
  values: Partial<z.infer<TSchema>>,
  errors: ValidationErrors<z.infer<TSchema>>,
) => {
  const AutoFormField = <TField extends keyof z.infer<TSchema>>({
    name,
    label,
    value,
    disabled,
  }: AutoFormFieldProps<TSchema, TField>) => {
    // TODO restrict TField to string only
    if (typeof name !== 'string') {
      throw new Error('field name must be a string');
    }

    const element = getZodElement(schema, name);
    const isOptional = element.isOptional();
    const props = {
      label: label ?? formatLabel(name),
      id: name,
      state: errors[name] ? ('error' as const) : ('default' as const),
      stateRelatedMessage: errors[name],
      disabled,
    };
    const { type, options } = getProps(element, isOptional);
    const defaultValue = value ?? values[name];
    const nativeProps = {
      name: encodeURIComponent(name), // NB field name is URI encoded ! must be decoded to read
      required: !isOptional,
      'aria-required': !isOptional,
      defaultValue: defaultValue !== undefined ? String(defaultValue) : undefined,
      type,
    };

    if (type === 'date') {
      return (
        <InputDate
          {...props}
          nativeInputProps={{
            ...nativeProps,
            type: 'date',
            defaultValue: defaultValue as Iso8601DateTime,
          }}
        />
      );
    }

    if (options) {
      return <Select {...props} nativeSelectProps={nativeProps} options={options} />;
    }

    return <Input {...props} nativeInputProps={nativeProps} />;
  };
  return AutoFormField;
};

function getZodElement<TSchema extends ZodSchema>(schema: TSchema, name: string) {
  if (schema instanceof z.ZodEffects) {
    return getZodElement(schema.sourceType(), name);
  }

  if (schema instanceof z.ZodOptional) {
    return getZodElement(schema.unwrap(), name);
  }

  const shape = schema._def.shape() as z.ZodRawShape;
  return shape[name];
}

const getProps = (
  element: z.ZodTypeAny,
  isOptional: boolean,
): { options?: SelectProps.Option[]; type?: HTMLInputTypeAttribute } => {
  const options = isOptional ? [{ value: '', label: '' }] : [];

  // ignore effects
  if (element instanceof z.ZodEffects) {
    return getProps(element.sourceType(), isOptional);
  }

  // In case of an optional, get the underlying type
  if (element instanceof z.ZodOptional) {
    return getProps(element._def.innerType, isOptional);
  }

  // In case of a union, get the first item of the union (hacky!)
  if (element instanceof z.ZodUnion) {
    return getProps((element as z.ZodUnion<z.ZodUnionOptions>)._def.options[0], isOptional);
  }
  // In case of an enum, return its values
  if (element instanceof z.ZodEnum) {
    return {
      options: options.concat(
        (element._def.values as string[]).map((o) => ({
          value: o,
          label: o
            .replaceAll('-', ' ')
            .split(' ')
            .map((s) => s[0].toUpperCase() + s.slice(1))
            .join(' '),
        })),
      ),
    };
  }
  // In case of a boolean, return true, false
  if (element instanceof z.ZodBoolean) {
    return {
      options: options.concat({ value: 'true', label: 'Oui' }, { value: 'false', label: 'Non' }),
    };
  }
  if (element instanceof z.ZodDate) {
    return {
      type: 'date',
    };
  }
  if (element instanceof z.ZodNumber) {
    return { type: 'number' };
  }
  if (element instanceof z.ZodString && element._def.checks.find((c) => c.kind === 'email')) {
    return { type: 'email' };
  }
  return {};
};

// uppercase first letter, and split words at each capital
// eg: motifÉlimination => Motif Élimination
const formatLabel = (fieldName: string) =>
  fieldName[0].toUpperCase() +
  fieldName.slice(1).replace(/([a-z\u00E0-\u00FC])?([A-Z\u00C0-\u00DC])/g, '$1 $2');
