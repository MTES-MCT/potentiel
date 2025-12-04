// eslint-disable-next-line no-restricted-imports
import { Ajv2020, ValidationError, ValidateFunction } from 'ajv/dist/2020.js';
// eslint-disable-next-line no-restricted-imports
import type { JTDDataType } from 'ajv/dist/core.js';

import { schemas } from '@potentiel-applications/api-documentation';

import { BadRequestError } from '../errors.js';

const ajv = new Ajv2020();

for (const [name, schema] of Object.entries(schemas)) {
  ajv.addSchema(schema, name);
}

type SchemasTypes = typeof schemas;

export const validate = <T extends keyof SchemasTypes>(
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
