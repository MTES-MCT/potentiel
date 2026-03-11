// eslint-disable-next-line no-restricted-imports
import { Ajv2020, ValidationError, ValidateFunction } from 'ajv/dist/2020.js';
// eslint-disable-next-line no-restricted-imports
import type { JTDDataType } from 'ajv/dist/core.js';
import addFormats from 'ajv-formats';

import { BadRequestError } from '../errors.js';

export const createSchemaValidator = <SchemasTypes extends Record<string, object>>(
  schemas: SchemasTypes,
) => {
  const ajv = new Ajv2020();
  addFormats.default(ajv);

  for (const [name, schema] of Object.entries(schemas)) {
    ajv.addSchema(schema, name);
  }

  const validate = <T extends Extract<keyof SchemasTypes, string>>(
    type: T,
    ...[data, dataCtx]: Parameters<ValidateFunction>
  ): JTDDataType<SchemasTypes[T]> => {
    const schema = ajv.getSchema<JTDDataType<SchemasTypes[T]>>(type);
    if (!schema) {
      throw new Error(`Schema ${type} not found`);
    }
    if (!schema(data, dataCtx)) {
      const error = new ValidationError(schema.errors ?? []);
      if (error.errors.length === 1) {
        const err = error.errors[0];
        const formattedError = err.message;
        const formattedMessage = err.instancePath
          ? `Validation failed (${err.instancePath})`
          : 'Validation failed';
        throw new BadRequestError(`${formattedMessage}: ${formattedError}`);
      }
      throw new BadRequestError(`Validation failed`, error.errors);
    }
    return data;
  };

  return validate;
};
