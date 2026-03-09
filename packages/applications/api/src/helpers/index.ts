import { schemas } from '@potentiel-applications/api-documentation';

import { createSchemaValidator } from './validate.js';

export * from './pagination.js';
export * from './utilisateur.js';

export const validate = createSchemaValidator(schemas);
