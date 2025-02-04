import z from 'zod';

import { optionalStringSchema } from '../../candidature/importer/candidature.schema';

export const candidatureNotifiéeSchema = z.object({
  societeMere: optionalStringSchema,
});

export const lauréatSchema = z.object({
  actionnaire: optionalStringSchema,
});
